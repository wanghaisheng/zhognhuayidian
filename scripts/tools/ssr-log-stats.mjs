// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.377Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
import fs from 'node:fs';
import path from 'node:path';

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/ssr-log-stats.mjs <logfile>');
    process.exit(1);
  }
  const p = path.resolve(file);
  if (!fs.existsSync(p)) {
    console.error('Log file not found:', p);
    process.exit(1);
  }
  const lines = fs.readFileSync(p, 'utf-8').split(/\r?\n/).filter(Boolean);
  const stats = { hit: 0, bypass: 0, error: 0, paths: {}, reasons: {}, p95: 0, times: [] };
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (!obj || !obj.event) continue;
      if (obj.event === 'hit') {
        stats.hit++;
        if (typeof obj.ms === 'number') stats.times.push(obj.ms);
        stats.paths[obj.path] = (stats.paths[obj.path] || 0) + 1;
      } else if (obj.event === 'bypass') {
        stats.bypass++;
        const r = obj.reason || 'unknown';
        stats.reasons[r] = (stats.reasons[r] || 0) + 1;
      } else if (obj.event === 'error') {
        stats.error++;
      }
    } catch {}
  }
  stats.times.sort((a, b) => a - b);
  const idx = Math.floor(stats.times.length * 0.95);
  stats.p95 = stats.times.length ? stats.times[Math.min(idx, stats.times.length - 1)] : 0;
  console.log(JSON.stringify(stats, null, 2));
}

main();
