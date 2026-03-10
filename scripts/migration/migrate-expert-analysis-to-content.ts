// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.363Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { expertAnalysisData as enExpertAnalysis } from '../src/locales/en/data/expertAnalysis';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { expertAnalysisData as zhExpertAnalysis } from '../src/locales/zh/data/expertAnalysis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ensureDir = (p: string) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};

const fm = (obj: Record<string, unknown>) => `---\n${yaml.dump(obj)}---\n`;

const toMarkdown = (locale: 'en' | 'zh', data: { expertProfiles: unknown[]; industryInsights: unknown[] }) => {
  const title = locale === 'zh' ? '专家分析概览' : 'Expert Analysis Overview';
  const description = locale === 'zh' ? '专家团队与行业洞察汇总' : 'Summary of expert profiles and industry insights';
  const frontMatter = {
    title,
    description,
    slug: 'expert-analysis',
    category: 'analysis',
    status: 'published',
    seo: {
      title,
      description,
      keywords: 'expert analysis, medical imaging, reports'
    },
    expertProfiles: data.expertProfiles,
    industryInsights: data.industryInsights,
    contentType: 'analysis'
  };
  const body = `# ${title}\n\n${description}\n`;
  return fm(frontMatter) + body;
};

const writeFile = (p: string, content: string) => {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf-8');
};

const run = () => {
  const enPath = path.resolve(rootDir, 'content', 'reports', 'en', 'expert-analysis.md');
  const zhPath = path.resolve(rootDir, 'content', 'reports', 'zh', 'expert-analysis.md');
  writeFile(enPath, toMarkdown('en', enExpertAnalysis));
  writeFile(zhPath, toMarkdown('zh', zhExpertAnalysis));
};

run();
