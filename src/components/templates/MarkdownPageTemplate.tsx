import React, { useMemo, useState } from 'react';
import SEOHead from '@/components/molecules/SEOHead';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from '@tanstack/react-router';
import LangLink from '@/components/molecules/LangLink';
import { MarkdownContent } from '../../lib/markdown';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import { SITE_CONFIG } from '@/config/site';
import { MarkdownRenderer } from '../molecules/MarkdownRenderer';
import { AuthorCard } from '../molecules/AuthorCard';
import { getAuthor } from '@/data/mock/authors';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { TableOfContents } from '../molecules/TableOfContents';
import { generateCanonicalUrl, getLocalizedSEOConfig, optimizeDescription } from '@/utils/seo';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';

type MarkKind = 'mandatory' | 'important' | 'other';

type ParsedMarkdownTable = {
  headers: string[];
  rows: string[][];
};

const normalizeCell = (value: string) => value.replace(/\s+/g, ' ').trim();

const parseMarkdownRow = (line: string): string[] => {
  const trimmed = line.trim();
  const withoutOuterPipes = trimmed.startsWith('|') ? trimmed.slice(1) : trimmed;
  const normalized = withoutOuterPipes.endsWith('|') ? withoutOuterPipes.slice(0, -1) : withoutOuterPipes;
  return normalized.split('|').map(cell => normalizeCell(cell));
};

const isSeparatorRow = (line: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);

const extractFirstMarkdownTable = (markdown: string): ParsedMarkdownTable | null => {
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const next = lines[i + 1];

    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const looksLikeHeader = line.includes('|') && parseMarkdownRow(line).length >= 2;
    if (!looksLikeHeader) continue;
    if (!isSeparatorRow(next)) continue;

    const headers = parseMarkdownRow(line);
    const rows: string[][] = [];
    for (let j = i + 2; j < lines.length; j++) {
      const rowLine = lines[j];
      if (!rowLine.trim()) break;
      if (!rowLine.includes('|')) break;
      if (rowLine.trim().startsWith('#')) break;
      rows.push(parseMarkdownRow(rowLine));
    }

    if (rows.length === 0) return null;
    return { headers, rows };
  }

  return null;
};

const getMarkKind = (mark: string): MarkKind => {
  const m = mark.trim();
  if (m.includes('★')) return 'mandatory';
  if (m.includes('▲')) return 'important';
  return 'other';
};

const extractSectionBullets = (markdown: string, headingMatchers: RegExp[]): string[] => {
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  let start = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (headingMatchers.some(re => re.test(line))) {
      start = i + 1;
      break;
    }
  }

  if (start === -1) return [];

  const bullets: string[] = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) break;
    if (/^#{1,6}\s+/.test(line)) break;
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) bullets.push(trimmed.slice(2).trim());
  }

  return bullets;
};

const downloadTextFile = (filename: string, text: string, mimeType: string) => {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

interface MarkdownPageTemplateProps {
  content: MarkdownContent;
  breadcrumbs?: Array<{ label: string; href: string }>;
  showRelated?: boolean;
  showMeta?: boolean;
  className?: string;
}

export const MarkdownPageTemplate: React.FC<MarkdownPageTemplateProps> = ({
  content,
  breadcrumbs,
  showRelated = true,
  showMeta = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { toc } = useTableOfContents(content.content);
  const pageLanguage = getLanguageFromPath(location.pathname);
  const canonicalUrl = generateCanonicalUrl(location.pathname, pageLanguage);
  const localized = getLocalizedSEOConfig(String(pageLanguage), location.pathname) || null;
  const finalTitle = (localized?.title as string) || content.frontMatter.seo.title;
  const finalDescription = optimizeDescription((localized?.description as string) || content.frontMatter.seo.description, String(pageLanguage));
  const [specQuery, setSpecQuery] = useState('');
  const [specTab, setSpecTab] = useState<'all' | MarkKind>('all');
  const [copied, setCopied] = useState(false);
  const fm = content.frontMatter as unknown as {
    faqs?: Array<{ question: string; answer: string }>;
    comparisonEntities?: { brandA?: { name?: string }; brandB?: { name?: string } };
    entities?: {
      regionA?: { name?: string };
      regionB?: { name?: string };
      brandA?: { name?: string };
      brandB?: { name?: string };
    };
    itemList?: Array<{ name?: string; href?: string }>;
    product?: { name?: string; brand?: string; category?: string };
    offers?: Array<{ priceCurrency?: string; price?: number; availability?: string; url?: string }>;
  };
  const faqSchema = Array.isArray(fm.faqs) && fm.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (fm.faqs as Array<{ question: string; answer: string }>).map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;
  const itemListSchema = Array.isArray(fm.itemList) && fm.itemList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": (fm.itemList as Array<{ name?: string; href?: string }>).map((it, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Organization",
        "name": it.name,
        "url": it.href ? `${SITE_CONFIG.url}${it.href}` : undefined
      }
    }))
  } : null;
  const productOfferSchema = (() => {
    const product = fm.product;
    const offers = fm.offers;
    if (!product || !product.name) return null;
    const schema: {
      "@context": string;
      "@type": string;
      name: string | undefined;
      brand?: { "@type": string; name?: string };
      category?: string;
      offers?: Array<{
        "@type": string;
        priceCurrency?: string;
        price?: number;
        availability?: string;
        url?: string;
      }>;
    } = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
      category: product.category || "Medical Imaging Equipment"
    };
    if (Array.isArray(offers) && offers.length > 0) {
      schema.offers = offers.map(of => ({
        "@type": "Offer",
        priceCurrency: of.priceCurrency,
        price: of.price,
        availability: of.availability,
        url: of.url ? `${SITE_CONFIG.url}${of.url}` : canonicalUrl
      }));
    }
    return schema;
  })();
  const comparisonProductSchemas: object[] = (() => {
    const schemas: object[] = [];
    const brandA = fm?.comparisonEntities?.brandA;
    const brandB = fm?.comparisonEntities?.brandB;
    const entityAName = brandA?.name || fm?.entities?.regionA?.name || fm?.entities?.brandA?.name;
    const entityBName = brandB?.name || fm?.entities?.regionB?.name || fm?.entities?.brandB?.name;
    if (entityAName) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": entityAName,
        "category": "Medical Imaging Equipment"
      });
    }
    if (entityBName) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": entityBName,
        "category": "Medical Imaging Equipment"
      });
    }
    return schemas;
  })();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'guide': return '📖';
      case 'tutorial': return '🎯';
      case 'reference': return '📚';
      case 'analysis': return '📊';
      default: return '📄';
    }
  };

  const capitalize = (s?: string) =>
    s && typeof s === 'string' && s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  const isSpecificationsPage = useMemo(() => {
    const slug = (content.frontMatter.slug || '').toLowerCase();
    const title = (content.frontMatter.title || '').toLowerCase();
    const tags = Array.isArray(content.frontMatter.tags) ? content.frontMatter.tags.join(' ').toLowerCase() : '';
    return slug.includes('specifications') || title.includes('specifications') || tags.includes('tender specs') || tags.includes('招标');
  }, [content.frontMatter.slug, content.frontMatter.tags, content.frontMatter.title]);

  const labels = useMemo(() => {
    if (pageLanguage === 'zh') {
      return {
        checklistTitle: '参数清单',
        all: '全部',
        mandatory: '★必选',
        important: '▲关键',
        other: '其他',
        searchPlaceholder: '搜索条款（模块/要求）…',
        total: '条款',
        exportCsv: '导出 CSV',
        print: '打印',
        copyLink: '复制链接',
        copied: '已复制',
        legend: '标注说明',
        proof: '证明材料',
        noResults: '未找到匹配条款',
      };
    }
    return {
      checklistTitle: 'Checklist',
      all: 'All',
      mandatory: '★ Mandatory',
      important: '▲ Scoring',
      other: 'Other',
      searchPlaceholder: 'Search clauses (area/requirement)…',
      total: 'items',
      exportCsv: 'Export CSV',
      print: 'Print',
      copyLink: 'Copy link',
      copied: 'Copied',
      legend: 'Legend',
      proof: 'Proof materials',
      noResults: 'No matching items',
    };
  }, [pageLanguage]);

  const parsedSpecTable = useMemo(() => (isSpecificationsPage ? extractFirstMarkdownTable(content.content) : null), [content.content, isSpecificationsPage]);

  const specColumns = useMemo(() => {
    if (!parsedSpecTable) return null;
    const headers = parsedSpecTable.headers.map(h => h.toLowerCase());
    const findIndex = (pred: (h: string) => boolean) => {
      const idx = headers.findIndex(pred);
      return idx >= 0 ? idx : -1;
    };
    const areaIndex = findIndex(h => h.includes('area') || h.includes('模块'));
    const requirementIndex = findIndex(h => h.includes('require') || h.includes('要求'));
    const markIndex = findIndex(h => h.includes('mark') || h.includes('标注'));
    return {
      areaIndex: areaIndex >= 0 ? areaIndex : 0,
      requirementIndex: requirementIndex >= 0 ? requirementIndex : 1,
      markIndex: markIndex >= 0 ? markIndex : 2,
    };
  }, [parsedSpecTable]);

  const specRows = useMemo(() => {
    if (!parsedSpecTable || !specColumns) return [];
    return parsedSpecTable.rows
      .map((cells) => {
        const area = normalizeCell(cells[specColumns.areaIndex] || '');
        const requirement = normalizeCell(cells[specColumns.requirementIndex] || '');
        const mark = normalizeCell(cells[specColumns.markIndex] || '');
        return {
          area,
          requirement,
          mark,
          kind: getMarkKind(mark),
        };
      })
      .filter(r => r.area || r.requirement || r.mark);
  }, [parsedSpecTable, specColumns]);

  const proofBullets = useMemo(() => {
    if (!isSpecificationsPage) return [];
    return extractSectionBullets(content.content, [
      /^##\s+Proof materials to prepare\s*$/i,
      /^##\s+证明材料.*$/i,
      /^##\s+证明材料准备.*$/i,
    ]);
  }, [content.content, isSpecificationsPage]);

  const specStats = useMemo(() => {
    const total = specRows.length;
    const mandatory = specRows.filter(r => r.kind === 'mandatory').length;
    const important = specRows.filter(r => r.kind === 'important').length;
    const other = total - mandatory - important;
    return { total, mandatory, important, other };
  }, [specRows]);

  const filteredSpecRows = useMemo(() => {
    const q = specQuery.trim().toLowerCase();
    return specRows.filter(r => {
      if (specTab !== 'all' && r.kind !== specTab) return false;
      if (!q) return true;
      return `${r.area} ${r.requirement} ${r.mark}`.toLowerCase().includes(q);
    });
  }, [specQuery, specRows, specTab]);

  const exportSpecCsv = () => {
    if (!parsedSpecTable) return;
    const safe = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const header = parsedSpecTable.headers.map(safe).join(',');
    const rows = specRows.map(r => [r.area, r.requirement, r.mark].map(safe).join(','));
    const csv = [header, ...rows].join('\n');
    const filename = `${content.frontMatter.slug || 'specifications'}.csv`;
    downloadTextFile(filename, csv, 'text/csv;charset=utf-8');
  };

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      downloadTextFile(`${content.frontMatter.slug || 'link'}.txt`, canonicalUrl, 'text/plain;charset=utf-8');
    }
  };
  
  return (
    <>
      <SEOHead
        title={finalTitle}
        description={finalDescription}
        canonicalUrl={canonicalUrl}
        author={content.frontMatter.author}
        publishDate={content.frontMatter.publishedAt}
        modifiedDate={content.frontMatter.updatedAt}
        articleSection={content.frontMatter.category}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": content.frontMatter.schemaType || "Article",
            "headline": content.frontMatter.title,
            "description": content.frontMatter.description,
            "author": {
              "@type": content.frontMatter.authorCredentials ? "Person" : "Organization",
              "name": content.frontMatter.author,
              "jobTitle": content.frontMatter.authorCredentials,
              "description": content.frontMatter.authorBio
            },
            "publisher": {
              "@type": "Organization",
              "name": SITE_CONFIG.name,
              "url": SITE_CONFIG.url,
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_CONFIG.url}/logo.png`
              }
            },
            "datePublished": content.frontMatter.publishedAt,
            "dateModified": content.frontMatter.updatedAt,
            "reviewedBy": content.frontMatter.reviewer ? {
              "@type": "Person",
              "name": content.frontMatter.reviewer?.name,
              "jobTitle": content.frontMatter.reviewer?.title
            } : undefined,
            "lastReviewed": content.frontMatter.lastReviewedAt,
            "citation": content.frontMatter.citations?.map((c: { text: string }) => c.text),
            "medicalSpecialty": content.frontMatter.medicalSpecialty?.map((spec: string) => ({
              "@type": "MedicalSpecialty",
              "name": spec
            })),
            "audience": content.frontMatter.audience ? {
              "@type": "Audience",
              "audienceType": content.frontMatter.audience
            } : undefined,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "keywords": content.frontMatter.seo?.keywords || (Array.isArray(content.frontMatter.tags) ? content.frontMatter.tags : []).join(", "),
            "articleSection": content.frontMatter.category,
            "wordCount": content.content.split(' ').length,
            "timeRequired": `PT${content.frontMatter.readingTime}M`
          },
          breadcrumbs && breadcrumbs.length > 0 ? {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": (breadcrumbs || []).map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.label,
              "item": `${SITE_CONFIG.url}${crumb.href}`
            }))
          } : null,
          faqSchema,
          itemListSchema,
          productOfferSchema,
          ...comparisonProductSchemas
        ].filter(Boolean)}
      />
      
      <div className={`min-h-screen bg-gray-50 ${className}`}>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-6" />}
          
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            <header className="p-8 pb-6 border-b border-gray-100 max-w-5xl mx-auto">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600">
                  {getContentTypeIcon(String(content.frontMatter.contentType || 'article'))}
                  {capitalize(String(content.frontMatter.contentType || 'article'))}
                </span>
                
                {typeof content.frontMatter.difficulty === 'string' && content.frontMatter.difficulty.length > 0 && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(String(content.frontMatter.difficulty))}`}>
                    {capitalize(String(content.frontMatter.difficulty))}
                  </span>
                )}
                
                <span className="inline-flex items-center text-sm text-gray-500">
                  ⏱️ {t('common.minRead', { minutes: content.frontMatter.readingTime })}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {content.frontMatter.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {content.frontMatter.description}
              </p>
              
              {showMeta && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span>{t('common.byAuthor', { name: content.frontMatter.author })}</span>
                  <span>•</span>
                  <span>{t('common.publishedOn', { date: formatDate(content.frontMatter.publishedAt) })}</span>
                  {content.frontMatter.updatedAt !== content.frontMatter.publishedAt && (
                    <>
                      <span>•</span>
                      <span>{t('common.updatedOn', { date: formatDate(content.frontMatter.updatedAt) })}</span>
                    </>
                  )}
                  {content.frontMatter.reviewer && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {t('common.reviewedBy', { name: content.frontMatter.reviewer.name })}
                      </span>
                    </>
                  )}
                </div>
              )}
              
              {Array.isArray(content.frontMatter.tags) && content.frontMatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {content.frontMatter.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            
            <div className="flex flex-col lg:flex-row px-4 lg:px-8 py-8 gap-6 xl:gap-8 relative items-start">
              
              {/* Left Sidebar: TOC - LG+ */}
              <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-24 self-start">
                <TableOfContents toc={toc} />
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {isSpecificationsPage && parsedSpecTable && (
                  <div className="max-w-[1000px] mx-auto px-4 sm:px-6 mb-10">
                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{labels.checklistTitle}</h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {specStats.total} {labels.total} • {labels.mandatory} {specStats.mandatory} • {labels.important} {specStats.important}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={copyPageLink}
                            className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                          >
                            {copied ? labels.copied : labels.copyLink}
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                          >
                            {labels.print}
                          </button>
                          <button
                            type="button"
                            onClick={exportSpecCsv}
                            className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                          >
                            {labels.exportCsv}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col lg:flex-row lg:items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                          {(['all', 'mandatory', 'important', 'other'] as const).map((k) => {
                            const active = specTab === k;
                            const text =
                              k === 'all' ? labels.all :
                              k === 'mandatory' ? labels.mandatory :
                              k === 'important' ? labels.important :
                              labels.other;
                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => setSpecTab(k)}
                                className={[
                                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                                  active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                ].join(' ')}
                              >
                                {text}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex-1">
                          <input
                            value={specQuery}
                            onChange={(e) => setSpecQuery(e.target.value)}
                            placeholder={labels.searchPlaceholder}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                          />
                        </div>
                      </div>

                      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                <th className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{parsedSpecTable.headers[specColumns?.areaIndex ?? 0] || 'Area'}</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">{parsedSpecTable.headers[specColumns?.requirementIndex ?? 1] || 'Requirement'}</th>
                                <th className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{parsedSpecTable.headers[specColumns?.markIndex ?? 2] || 'Mark'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredSpecRows.length === 0 ? (
                                <tr>
                                  <td className="px-4 py-6 text-gray-500" colSpan={3}>{labels.noResults}</td>
                                </tr>
                              ) : (
                                filteredSpecRows.map((row, idx) => (
                                  <tr key={`${row.area}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.area || '—'}</td>
                                    <td className="px-4 py-3 text-gray-700">{row.requirement || '—'}</td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={[
                                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border",
                                          row.kind === 'mandatory' ? "bg-red-50 text-red-700 border-red-100" :
                                          row.kind === 'important' ? "bg-amber-50 text-amber-800 border-amber-100" :
                                          "bg-gray-50 text-gray-700 border-gray-100"
                                        ].join(' ')}
                                      >
                                        {row.mark || '—'}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <MarkdownRenderer content={content.content} hideH1={true} />

                {/* EEAT Citations Section */}
                {content.frontMatter.citations && content.frontMatter.citations.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">{t('common.referencesCitations')}</h3>
                    <ul className="space-y-2">
                      {content.frontMatter.citations.map((citation, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex gap-2">
                          <span className="select-none text-gray-300">[{idx + 1}]</span>
                          {citation.url ? (
                            <a 
                              href={citation.url} 
                              target="_blank" 
                              rel="noopener noreferrer nofollow"
                              className="hover:text-blue-600 hover:underline transition-colors"
                            >
                              {citation.text}
                            </a>
                          ) : (
                            <span>{citation.text}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Author Card (Bottom) */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('common.writtenBy')}</p>
                   <AuthorCard author={getAuthor(content.frontMatter.author?.toLowerCase())} />
                </div>
              </div>

              {/* Sidebar - Author (Right) */}
              <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-24 self-start">
                  <div className="space-y-8">
                    {isSpecificationsPage && (proofBullets.length > 0 || specStats.total > 0) && (
                      <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{labels.legend}</div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{labels.mandatory}</span>
                            <span className="font-semibold text-gray-900">{specStats.mandatory}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{labels.important}</span>
                            <span className="font-semibold text-gray-900">{specStats.important}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{labels.other}</span>
                            <span className="font-semibold text-gray-900">{specStats.other}</span>
                          </div>
                        </div>
                        {proofBullets.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{labels.proof}</div>
                            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5 marker:text-gray-300">
                              {proofBullets.slice(0, 6).map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('common.writtenBy')}</p>
                      <AuthorCard author={getAuthor(content.frontMatter.author?.toLowerCase())} layout="vertical" />
                    </div>
                  </div>
              </aside>
            </div>
          </article>
          
          {showRelated && content.frontMatter.related && content.frontMatter.related.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.relatedArticles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.frontMatter.related.map(item => (
                  <LangLink
                    key={item.slug}
                    to={`/learn/${item.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <span className="text-sm text-blue-600 font-medium">{t('common.readMore')} →</span>
                  </LangLink>
                ))}
              </div>
            </div>
          )}
          
          {/* Language Switcher */}
          {content.frontMatter.translations && Object.keys(content.frontMatter.translations).length > 1 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('common.availableLanguages')}</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(content.frontMatter.translations).map(([lang, url]) => (
                  <Link
                    key={lang}
                    to={url}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {lang === 'en' ? '🇺🇸 English' : '🇨🇳 中文'}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
