
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBookSlug, generateAuthorSlug } from '../../src/utils/urlStructure';
import { LANGUAGES } from '../../src/config/language';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeRoutePath = (input: string): string => {
  let p = String(input || '').trim();
  if (!p) return '/';
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.split('?')[0].split('#')[0];
  p = p.replace(/\/+/g, '/');
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p;
};

const getLanguageVariants = (basePath: string): string[] => {
  const normalized = normalizeRoutePath(basePath);
  return LANGUAGES.map((lang) => {
    if (lang.prefix === '') return normalized;
    if (normalized === '/') return lang.prefix;
    return `${lang.prefix}${normalized}`;
  });
};

const listMarkdownSlugs = (category: string, locale: string): string[] => {
  const dirPath = path.join(__dirname, `../content/${category}/${locale}`);
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
    .filter(Boolean);
};

const readFrontMatter = (filePath: string): Record<string, unknown> => {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const parts = content.split('---').map(s => s.trim());
  if (parts.length < 3) return {};
  const fm = parts[1];
  const lines = fm.split('\n').map(l => l.trim()).filter(Boolean);
  const obj: Record<string, unknown> = {};
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2];
    if (val.startsWith('[') && val.endsWith(']')) {
      const arr = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      obj[key] = arr;
    } else {
      obj[key] = val.replace(/^["']|["']$/g, '');
    }
  }
  return obj;
};

const collectDeviceEntries = (): Array<{ slug: string; type: 'ct' | 'mri' }> => {
  const locales = ['en', 'zh'];
  const entries: Array<{ slug: string; type: 'ct' | 'mri' }> = [];
  for (const locale of locales) {
    const dirPath = path.join(__dirname, `../content/devices/${locale}`);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter(n => n.endsWith('.md'));
    for (const f of files) {
      const fp = path.join(dirPath, f);
      const fm = readFrontMatter(fp);
      const slug = String((fm.slug as string) || f.replace(/\.md$/, '')).trim();
      const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : [];
      const isMRI = tags.some(t => t.toLowerCase().includes('mri'));
      const type: 'ct' | 'mri' = isMRI ? 'mri' : 'ct';
      entries.push({ slug, type });
    }
  }
  const seen = new Set<string>();
  const unique: Array<{ slug: string; type: 'ct' | 'mri' }> = [];
  for (const e of entries) {
    const key = `${e.type}:${e.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(e);
  }
  return unique;
};

const collectManufacturerSlugs = (): string[] => {
  const locales = ['en', 'zh'];
  const slugs: string[] = [];
  for (const locale of locales) {
    const dirPath = path.join(__dirname, `../content/manufacturers/${locale}`);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter(n => n.endsWith('.md'));
    for (const f of files) {
      const fp = path.join(dirPath, f);
      const fm = readFrontMatter(fp);
      const slug = String((fm.slug as string) || f.replace(/\.md$/, '')).trim();
      slugs.push(slug);
    }
  }
  return Array.from(new Set(slugs));
};

const generateRoutes = async () => {
  console.log('🔄 Generating routes from data files...');
  
  const routes: string[] = [];

  const staticRoutes = [
    '/',
    '/devices',
    '/manufacturers',
    '/compare',
    '/compare/ct-scanners',
    '/compare/mri-scanners',
    '/history',
    '/pricing',
    '/learn',
    '/blog',
    '/resources',
    '/reports',
    '/reports/market',
    '/reports/expert',
    '/about',
    '/contact',
    '/glossary',
    '/customers',
  ];

  for (const r of staticRoutes) {
    routes.push(...getLanguageVariants(r));
  }

  const devices = collectDeviceEntries();
  console.log(`📦 Found ${devices.length} devices from markdown`);
  for (const d of devices) {
    const categoryPath = d.type === 'ct' ? 'ct-scanners' : 'mri-scanners';
    const url = normalizeRoutePath(`/devices/${categoryPath}/${d.slug}`);
    routes.push(...getLanguageVariants(url));
  }

  const manufacturerSlugs = collectManufacturerSlugs();
  console.log(`🏭 Found ${manufacturerSlugs.length} manufacturers from markdown`);
  for (const slug of manufacturerSlugs) {
    const normalized = slug; // Use slug directly since generateManufacturerSlug doesn't exist
    routes.push(...getLanguageVariants(`/manufacturers/${normalized}`));
  }

  // 3. Category/Specification Routes (Manual for now, or extracted)
  // We can add logic here to extract all unique specifications and generate routes like /devices/ct-scanners/128-slice/
  // CT Specs
  routes.push(...getLanguageVariants('/devices/ct-scanners'));
  routes.push(...getLanguageVariants('/devices/ct-scanners/128-slice'));
  routes.push(...getLanguageVariants('/devices/ct-scanners/64-slice'));
  routes.push(...getLanguageVariants('/devices/ct-scanners/mobile'));
  routes.push(...getLanguageVariants('/devices/ct-scanners/dual-energy'));
  routes.push(...getLanguageVariants('/devices/ct-scanners/portable'));

  // MRI Specs
  routes.push(...getLanguageVariants('/devices/mri-scanners'));
  routes.push(...getLanguageVariants('/devices/mri-scanners/3t'));
  routes.push(...getLanguageVariants('/devices/mri-scanners/1.5t'));
  routes.push(...getLanguageVariants('/devices/mri-scanners/open'));
  routes.push(...getLanguageVariants('/devices/mri-scanners/wide-bore'));

  // 4. Learn (Markdown) Routes
  const learnEnSlugs = listMarkdownSlugs('learn', 'en');
  const learnZhSlugs = listMarkdownSlugs('learn', 'zh');
  const learnSlugs = Array.from(new Set([...learnEnSlugs, ...learnZhSlugs]));
  for (const slug of learnSlugs) {
    routes.push(...getLanguageVariants(`/learn/${slug}`));
  }

  // Remove duplicates and trailing slashes consistency (optional, but good)
  const uniqueRoutes = Array.from(new Set(routes.map(normalizeRoutePath)));

  const outputPath = path.join(__dirname, '../prerender-routes.json');
  fs.writeFileSync(outputPath, JSON.stringify(uniqueRoutes, null, 2));
  
  console.log(`✅ Generated ${uniqueRoutes.length} routes in prerender-routes.json`);
};

generateRoutes().catch(console.error);
