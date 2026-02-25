import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Customer } from '../src/types/customer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { customers as customersEn } from '../src/locales/en/data/customers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ensureDir = (p: string) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};

const writeJson = (p: string, data: unknown) => {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
};

const sanitizeId = (id: string) => id.replace(/[^a-z0-9-]/gi, '-').toLowerCase();

const migrate = (locale = 'en') => {
  const outDir = path.resolve(rootDir, 'src', 'data', 'snapshots', locale, 'content', 'customers');
  ensureDir(outDir);
  const source = customersEn as Customer[];
  for (const c of source) {
    const id = sanitizeId(c.id || c.name_en || c.name || 'customer');
    const outPath = path.resolve(outDir, `${id}.json`);
    writeJson(outPath, c);
    console.log(`✔ migrated ${id} -> ${path.relative(rootDir, outPath)}`);
  }
};

const locales = process.argv.slice(2);
if (!locales.length) {
  migrate('en');
} else {
  for (const l of locales) migrate(l);
}
