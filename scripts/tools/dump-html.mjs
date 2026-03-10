import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const serverEntry = path.join(root, 'dist/server/entry-server.js');
async function main() {
  const route = process.argv[2] || '/';
  if (!fs.existsSync(serverEntry)) {
    console.error('dist/server/entry-server.js 不存在，请先构建服务端产物（npm run build:server）');
    process.exit(1);
  }
  const { render } = await import(`file://${serverEntry}`);
  const result = await render(route, '<head-assets></head-assets>');
  const html = result.appHtml || '';
  console.log(`HTML length: ${html.length}`);
  console.log('--- FIRST 500 CHARS ---');
  console.log(html.slice(0, 500));
  console.log('--- HEAD SNIPPET ---');
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  console.log(head.slice(0, 2000));
  console.log('--- BODY OPEN ---');
  const bodyOpen = html.match(/<body[^>]*>/i)?.[0] || '';
  console.log(bodyOpen);
  process.exit(0);
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
