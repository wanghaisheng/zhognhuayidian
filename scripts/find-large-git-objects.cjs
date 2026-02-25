const { execSync } = require('child_process');

function sh(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
}

function toHuman(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

function main() {
  const revList = sh('git rev-list --objects --all');
  const lines = revList.split('\n').filter(Boolean);
  const entries = [];

  for (const line of lines) {
    const [hash, ...pathParts] = line.trim().split(' ');
    const path = pathParts.join(' ');
    try {
      const type = sh(`git cat-file -t ${hash}`).trim();
      if (type !== 'blob') continue;
      const sizeStr = sh(`git cat-file -s ${hash}`).trim();
      const size = parseInt(sizeStr, 10);
      entries.push({ hash, path, size });
    } catch (e) {
      // ignore
    }
  }

  entries.sort((a, b) => b.size - a.size);
  const top = entries.slice(0, 50);

  console.log('Top 50 largest git blobs across history:');
  for (const e of top) {
    console.log(`${toHuman(e.size).padStart(10)}  ${e.path || e.hash}  (${e.hash})`);
  }

  const byDir = new Map();
  for (const e of entries) {
    const dir = (e.path || '').includes('/') ? e.path.split('/')[0] : '(root)';
    byDir.set(dir, (byDir.get(dir) || 0) + e.size);
  }
  const dirTotals = Array.from(byDir.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20);
  console.log('\nFolder totals (history blobs):');
  for (const [dir, total] of dirTotals) {
    console.log(`${toHuman(total).padStart(10)}  ${dir}`);
  }
}

main();
