// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.375Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    const n = args[i + 1];
    switch (a) {
      case '--baseA': out.baseA = n; i++; break;
      case '--baseB': out.baseB = n; i++; break;
      case '--routes': out.routes = n; i++; break;
      case '--iterations': out.iterations = Number(n) || 3; i++; break;
      case '--concurrency': out.concurrency = Number(n) || 4; i++; break;
      case '--timeout': out.timeout = Number(n) || 15000; i++; break;
      default: break;
    }
  }
  if (!out.baseA || !out.baseB) {
    console.error('Usage: node scripts/ssr-compare.mjs --baseA <urlA> --baseB <urlB> [--routes <path>] [--iterations 3] [--concurrency 4] [--timeout 15000]');
    process.exit(1);
  }
  out.iterations ||= 3;
  out.concurrency ||= 4;
  out.timeout ||= 15000;
  return out;
}

function normalizeBase(u) {
  return u.endsWith('/') ? u.slice(0, -1) : u;
}

function normalizeRoute(p) {
  if (!p) return '/';
  let x = String(p).replace(/\/{2,}/g, '/');
  if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
  if (!x.startsWith('/')) x = '/' + x;
  return x;
}

function readRoutes(routesPath) {
  const root = path.resolve(process.cwd());
  const defaultPath = path.join(root, 'prerender-routes.json');
  const file = routesPath ? path.resolve(routesPath) : defaultPath;
  if (!fs.existsSync(file)) {
    console.warn(`Routes file not found at ${file}. Falling back to ['/'].`);
    return ['/'];
    }
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const set = new Set(data.map(normalizeRoute));
    return Array.from(set);
  } catch (e) {
    console.error('Failed to parse routes file:', e);
    return ['/'];
  }
}

async function fetchWithTiming(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const t0 = performance.now();
  let ttfb = NaN;
  let status = 0;
  let ok = false;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'text/html' },
      signal: controller.signal,
    });
    ttfb = performance.now() - t0;
    status = res.status;
    ok = res.ok;
    // Drain body
    await res.arrayBuffer();
    const total = performance.now() - t0;
    clearTimeout(timer);
    return { ok, status, ttfb, total };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, status: 0, ttfb: NaN, total: NaN, error: String(e?.message || e) };
  }
}

function pStats(values) {
  const arr = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (arr.length === 0) return { p50: NaN, p95: NaN, avg: NaN };
  const pick = (p) => {
    const idx = Math.ceil((p / 100) * arr.length) - 1;
    return arr[Math.min(Math.max(idx, 0), arr.length - 1)];
  };
  const sum = arr.reduce((a, b) => a + b, 0);
  return { p50: pick(50), p95: pick(95), avg: sum / arr.length };
}

async function runSet(base, routes, iterations, concurrency, timeout) {
  const baseNorm = normalizeBase(base);
  const results = {};
  for (const r of routes) {
    results[r] = { ttfb: [], total: [], ok: 0, fail: 0 };
  }
  const tasks = [];
  for (let i = 0; i < iterations; i++) {
    for (const r of routes) {
      const u = baseNorm + r;
      tasks.push(async () => {
        const m = await fetchWithTiming(u, timeout);
        if (m.ok) {
          results[r].ok++;
          results[r].ttfb.push(m.ttfb);
          results[r].total.push(m.total);
        } else {
          results[r].fail++;
        }
      });
    }
  }
  // Simple pool
  let idx = 0;
  const runners = new Array(concurrency).fill(0).map(async () => {
    while (idx < tasks.length) {
      const t = tasks[idx++];
      await t();
    }
  });
  await Promise.all(runners);
  // Summarize
  const summary = {};
  for (const r of routes) {
    const ttfbStats = pStats(results[r].ttfb);
    const totalStats = pStats(results[r].total);
    summary[r] = {
      ok: results[r].ok,
      fail: results[r].fail,
      ttfb: ttfbStats,
      total: totalStats,
    };
  }
  return summary;
}

function printCompare(sumA, sumB, labelA, labelB) {
  const routes = Array.from(new Set([...Object.keys(sumA), ...Object.keys(sumB)]));
  const lines = [];
  lines.push(`Route, ${labelA} TTFB p95(ms), ${labelB} TTFB p95(ms), Δ(ms), ${labelA} Total p95(ms), ${labelB} Total p95(ms), Δ(ms), OK(A/B), FAIL(A/B)`);
  for (const r of routes) {
    const a = sumA[r] || {};
    const b = sumB[r] || {};
    const aT = a.ttfb?.p95 ?? NaN;
    const bT = b.ttfb?.p95 ?? NaN;
    const aC = a.total?.p95 ?? NaN;
    const bC = b.total?.p95 ?? NaN;
    const dT = (bT - aT);
    const dC = (bC - aC);
    lines.push([
      r,
      isFinite(aT) ? aT.toFixed(1) : 'NaN',
      isFinite(bT) ? bT.toFixed(1) : 'NaN',
      isFinite(dT) ? dT.toFixed(1) : 'NaN',
      isFinite(aC) ? aC.toFixed(1) : 'NaN',
      isFinite(bC) ? bC.toFixed(1) : 'NaN',
      isFinite(dC) ? dC.toFixed(1) : 'NaN',
      `${a.ok ?? 0}/${b.ok ?? 0}`,
      `${a.fail ?? 0}/${b.fail ?? 0}`,
    ].join(', '));
  }
  console.log(lines.join('\n'));
}

async function main() {
  const { baseA, baseB, routes: routesPath, iterations, concurrency, timeout } = parseArgs();
  const routes = readRoutes(routesPath);
  console.log(`Comparing ${routes.length} routes: ${baseA} (A) vs ${baseB} (B)`);
  const sumA = await runSet(baseA, routes, iterations, concurrency, timeout);
  const sumB = await runSet(baseB, routes, iterations, concurrency, timeout);
  printCompare(sumA, sumB, 'A', 'B');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

