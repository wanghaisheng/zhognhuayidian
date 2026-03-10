// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.280Z
// 🔄 Purpose: Internationalization fixes (completed)
// 

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distServer = path.resolve(root, 'dist/server');

function normalizeWhitespace(str) {
  return String(str || '').replace(/\s+/g, ' ').trim();
}

function extract(html, selector) {
  if (selector === 'title') {
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? normalizeWhitespace(m[1]) : '';
  }
  if (selector === 'meta[name=description]') {
    const m = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    return m ? normalizeWhitespace(m[1]) : '';
  }
  if (selector === 'link[rel=canonical]') {
    const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    return m ? normalizeWhitespace(m[1]) : '';
  }
  return '';
}

function countTag(html, tag) {
  const re = new RegExp(`<${tag}\\b`, 'gi');
  const matches = html.match(re);
  return matches ? matches.length : 0;
}

function auditOneRoute(html, routePath, siteBase = 'https://chinactscanner.org') {
  const issues = { fail: [], warn: [] };
  const title = extract(html, 'title');
  const desc = extract(html, 'meta[name=description]');
  const canonical = extract(html, 'link[rel=canonical]');
  const h1Count = countTag(html, 'h1');

  if (!title) issues.warn.push(`[SEO] 缺失 Title`);
  if (!desc) issues.warn.push(`[SEO] 缺失 Description`);
  if (desc && desc.length < 50) issues.warn.push(`[SEO] Description 过短（${desc.length} chars）`);
  if (!canonical) {
    issues.fail.push(`[SEO] 缺失 canonical`);
  } else {
    let expected = `${siteBase}${routePath}`.replace(/^http:/, 'https:').replace(/\/+$/, '');
    let actual = canonical.replace(/^http:/, 'https:').replace(/\/+$/, '');
    if (actual !== expected) {
      issues.warn.push(`[SEO] canonical 非自引用：expected=${expected} actual=${actual}`);
    }
  }
  if (h1Count === 0) issues.fail.push(`[Content] 未找到 H1`);

  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const twCard = html.match(/<meta[^>]+name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const twTitle = html.match(/<meta[^>]+name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const twDesc = html.match(/<meta[^>]+name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const twImage = html.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  const ogIncomplete = !ogUrl || !ogTitle || !ogDesc || !ogImage || !twCard || !twTitle || !twDesc || !twImage;
  if (ogIncomplete) issues.warn.push('[SEO] OG/Twitter 元信息不完整');

  return issues;
}

async function main() {
  let route = process.argv[2] || '';
  const shouldApply = process.argv.includes('--apply');
  if (!route) {
    try {
      const prerenderPath = path.join(root, 'prerender-routes.json');
      if (fs.existsSync(prerenderPath)) {
        const list = JSON.parse(fs.readFileSync(prerenderPath, 'utf-8'));
        if (Array.isArray(list) && list.length) {
          route = list[Math.floor(Math.random() * list.length)];
        }
      }
    } catch {}
  }
  if (!route) route = '/';
  const serverEntry = path.join(distServer, 'entry-server.js');
  if (!fs.existsSync(serverEntry)) {
    console.error('dist/server/entry-server.js 不存在，请先构建服务端产物（npm run build:server）');
    process.exit(1);
  }
  const { render } = await import(`file://${serverEntry}`);

  console.log(`--- Rendering ${route} ---`);
  const result = await render(route, '<head-assets></head-assets>');
  const html = result.appHtml || '';

  if (!html) {
    console.error('SSR 输出为空，可能渲染失败');
  }

  const issues = auditOneRoute(html, route);
  const uniq = arr => Array.from(new Set(arr));
  issues.fail = uniq(issues.fail);
  issues.warn = uniq(issues.warn);

  console.log('--- Single Route Audit Report ---');
  if (issues.fail.length) {
    console.log(`FAIL (${issues.fail.length})`);
    issues.fail.forEach(i => console.log(` - ${i}`));
  }
  if (issues.warn.length) {
    console.log(`WARN (${issues.warn.length})`);
    issues.warn.forEach(i => console.log(` - ${i}`));
  }

  if (issues.fail.length === 0 && shouldApply) {
    console.log('--- 单路由通过，应用到全局（运行 post-build） ---');
    const run = spawnSync('node', ['scripts/post-build.js'], {
      cwd: root,
      stdio: 'inherit',
      shell: false,
    });
    if (run.status !== 0) {
      console.error('Post build 执行失败');
      process.exit(1);
    }
  } else {
    console.log('--- 跳过全量 post-build（默认保持单路由实验）。如需应用到全局，追加 --apply 参数运行 ---');
  }

  if (issues.fail.length) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
