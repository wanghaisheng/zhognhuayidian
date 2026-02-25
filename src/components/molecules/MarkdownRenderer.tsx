import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link as LinkIcon, Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import i18nInstance from '@/lib/i18n';
import { addLanguagePrefix } from '@/utils/multilingualRoutes';
import { getFullUrl } from '@/config/site';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  hideH1?: boolean;
}

const CodeBlock = ({ children, className, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean; node?: unknown }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!match) {
    return <code className="bg-primary/10 px-2 py-0.5 rounded text-primary font-mono text-[0.85em]" {...props}>{children}</code>;
  }

  return (
    <div className="cinematic-breakout my-10 relative group/code-block overflow-hidden rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-[#0d1117] shadow-2xl">
      <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 select-none">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-white/40 hover:text-white transition-all p-2 bg-white/5 rounded-lg active:scale-90"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <SyntaxHighlighter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={vscDarkPlus as any}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '2rem 2.5rem',
          background: 'transparent',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

const wrapRelativePathsWithMarkdownLinks = (input: string, currentLang: 'en' | 'zh'): string => {
  // Split by code fences to avoid touching code blocks
  const parts = input.split(/```/);
  return parts
    .map((segment, idx) => {
      // Only process non-code segments (even indices)
      if (idx % 2 === 1) return segment;
      // Replace plain `/path` tokens not already in markdown links/images
      // Preceded by start|space|中文冒号|英文冒号|（(|>
      // Avoid replacing paths immediately following ]( (already a markdown link)
      return segment.replace(
        /(^|[\s：（:(>])(\/[A-Za-z0-9/_\-.#?=&%]+)/g,
        (full, g1: string, g2: string, offset: number, str: string) => {
          // Check if right before the slash we have '](' which indicates existing markdown link
          const before = str.slice(Math.max(0, offset - 2), offset);
          if (before === '](') {
            return full; // keep original
          }
          const prefix = g1;
          const path = g2;
          const langPath = addLanguagePrefix(path, currentLang);
          const absolute = getFullUrl(langPath);
          return `${prefix}[${path}](${absolute})`;
        }
      );
    })
    .join('```');
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className, hideH1 }) => {
  const lang = (i18nInstance.language === 'zh' ? 'zh' : 'en') as 'en' | 'zh';
  const processed = wrapRelativePathsWithMarkdownLinks(content, lang);
  return (
    <div className={cn("max-w-[1000px] mx-auto px-4 sm:px-6", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
        ]}
        components={{
          // Tier 1: Focus (720px)
          p: ({ node, ...props }) => (
            <p className="max-w-[720px] mx-auto mb-10 text-lg leading-[1.8] text-gray-700 dark:text-gray-300" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="max-w-[720px] mx-auto mb-10 list-disc list-outside space-y-5 pl-5 marker:text-gray-400" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="max-w-[720px] mx-auto mb-10 list-decimal list-outside space-y-5 pl-5 tabular-nums marker:text-gray-500" {...props} />
          ),
          li: ({ node, children, ...props }) => {
            return (
              <li className="relative pl-2 leading-[1.8] text-gray-700 dark:text-gray-300" {...props}>
                {children}
              </li>
            );
          },
          // Tier 2: Rhythm (800px) - Blockquotes as Strong Leads
          blockquote: ({ node, ...props }) => (
            <blockquote className="max-w-[800px] mx-auto mt-16 mb-6 pl-8 border-l-4 border-primary/50 text-2xl font-medium leading-[1.4] text-gray-900 dark:text-gray-100 bg-transparent py-2" {...props} />
          ),

          h1: ({ node, ...props }) => {
            if (hideH1) {
              return (
                <h2 className="max-w-[800px] mx-auto mt-16 mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 group flex items-center" {...props}>
                  {props.children}
                  <a href={`#${props.id}`} aria-label="Link to this section" className="ml-3 opacity-0 group-hover:opacity-30 transition-opacity text-primary hover:opacity-100">
                    <LinkIcon size={18} />
                  </a>
                </h2>
              );
            }
            return <h1 className="max-w-[720px] mx-auto mt-16 mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-white" {...props} />;
          },
          h2: ({ node, ...props }) => (
            <h2 className="max-w-[800px] mx-auto mt-16 mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 group flex items-center" {...props}>
              {props.children}
              <a href={`#${props.id}`} aria-label="Link to this section" className="ml-3 opacity-0 group-hover:opacity-30 transition-opacity text-primary hover:opacity-100">
                <LinkIcon size={18} />
              </a>
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="max-w-[800px] mx-auto mt-12 mb-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 group flex items-center" {...props}>
              {props.children}
              <a href={`#${props.id}`} aria-label="Link to this section" className="ml-3 opacity-0 group-hover:opacity-30 transition-opacity text-primary hover:opacity-100">
                <LinkIcon size={16} />
              </a>
            </h3>
          ),
          h4: ({ node, ...props }) => (
            <h4 className="max-w-[800px] mx-auto mt-10 mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100" {...props} />
          ),

          // Tier 3: Cinematic (1000px - full width of container)
          code: CodeBlock,
          pre: ({ node, ...props }: React.ComponentPropsWithoutRef<'pre'> & { node?: unknown }) => {
            // Cast to any to avoid type mismatch between HTMLPreElement and HTMLDivElement
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return <div {...(props as any)} />;
          }, // Handled by CodeBlock
          
          table: ({ node, ...props }) => (
            <div className="cinematic-breakout my-12 w-full overflow-hidden rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" {...props} />
              </div>
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#0d1117]" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 text-gray-600 dark:text-gray-400" {...props} />
          ),
          
          img: ({ node, ...props }) => (
            <div className="cinematic-breakout my-12 w-full rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 bg-gray-50">
              <img 
                {...props} 
                className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700"
                loading="lazy"
              />
              {props.title && (
                <div className="px-6 py-3 bg-white/80 dark:bg-black/50 backdrop-blur-md text-sm text-center text-gray-500 font-medium">
                  {props.title}
                </div>
              )}
            </div>
          ),
          
          a: ({ node, ...props }) => {
            let href = props.href || '';
            // Normalize internal relative links to language-prefixed absolute URLs
            if (href && href.startsWith('/')) {
              const langHref = addLanguagePrefix(href, lang);
              href = getFullUrl(langHref);
            }
            const isExternal = href.startsWith('http');
            return (
              <a
                {...props}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-primary font-semibold underline decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary transition-all inline-flex items-center"
              >
                {props.children}
                {isExternal && <ExternalLink size={12} className="ml-0.5 opacity-50" />}
              </a>
            );
          },
          
          hr: () => <hr className="my-24 border-t border-gray-200 dark:border-white/10 max-w-[100px] mx-auto" />,
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
};
