import fs from 'fs';
import path from 'path';

type Metrics = {
  totalDevices: number;
  totalManufacturers: number;
  totalArticles: number;
  totalCountries: number;
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');
const SNAPSHOTS_DIR = path.join(ROOT, 'src', 'data', 'snapshots');

const LANGS = ['en', 'zh'];

const countMarkdownFiles = (dir: string) => {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    return files.filter((f) => f.isFile() && f.name.toLowerCase().endsWith('.md')).length;
  } catch {
    return 0;
  }
};

const computeMetricsForLang = (lang: string): Metrics => {
  const devicesDir = path.join(CONTENT_DIR, 'devices', lang);
  const manufacturersDir = path.join(CONTENT_DIR, 'manufacturers', lang);
  const historyDir = path.join(CONTENT_DIR, 'history', lang);
  const learnDir = path.join(CONTENT_DIR, 'learn', lang);
  const customersDir = path.join(CONTENT_DIR, 'customers', lang);

  const totalDevices = countMarkdownFiles(devicesDir);
  const totalManufacturers = countMarkdownFiles(manufacturersDir);
  const totalArticles = countMarkdownFiles(historyDir) + countMarkdownFiles(learnDir);

  // Derive countries from customers content if country is present in frontmatter; fallback to 1 if customers exist
  let totalCountries = 0;
  try {
    const files = fs.readdirSync(customersDir, { withFileTypes: true })
      .filter((f) => f.isFile() && f.name.toLowerCase().endsWith('.md'))
      .map((f) => path.join(customersDir, f.name));
    const countries = new Set<string>();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      // naive frontmatter country detection: country: XXX
      const match = content.match(/^\s*country:\s*([^\r\n]+)/m);
      if (match && match[1]) {
        countries.add(match[1].trim());
      }
    }
    if (countries.size > 0) {
      totalCountries = countries.size;
    } else if (files.length > 0) {
      totalCountries = 1; // assume single country coverage if customer content exists but no explicit country field
    }
  } catch {
    totalCountries = 0;
  }

  return {
    totalDevices,
    totalManufacturers,
    totalArticles,
    totalCountries,
  };
};

const updateSnapshot = (lang: string, metrics: Metrics) => {
  const filePath = path.join(SNAPSHOTS_DIR, lang, 'content', 'stats', 'global.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    json.metrics = {
      ...json.metrics,
      ...metrics,
    };
    json.updatedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`[stats] Updated ${filePath}`);
  } catch (err) {
    console.error(`[stats] Failed to update ${filePath}:`, (err as Error).message);
  }
};

const main = () => {
  for (const lang of LANGS) {
    const metrics = computeMetricsForLang(lang);
    updateSnapshot(lang, metrics);
  }
};

main();
