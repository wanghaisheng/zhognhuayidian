import { useState, useEffect } from 'react';

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export const useTableOfContents = (content: string) => {
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    if (!content) {
      setToc([]);
      return;
    }

    const lines = content.split('\n');
    const parsedHeadings: TableOfContentsItem[] = [];
    let inCodeBlock = false;
    const usedSlugs: Record<string, number> = {};
    
    const slugify = (text: string) => {
      let slug = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (!slug) slug = 'heading';
      return slug;
    };

    lines.forEach(line => {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return;
      }
      if (inCodeBlock) return;

      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        
        // Ignore H1 as it is usually the page title
        if (level === 1) return;

        const originalSlug = slugify(text);
        let slug = originalSlug;
        
        if (usedSlugs[originalSlug] !== undefined) {
          usedSlugs[originalSlug]++;
          slug = `${originalSlug}-${usedSlugs[originalSlug]}`;
        } else {
          usedSlugs[originalSlug] = 0;
        }

        parsedHeadings.push({ id: slug, text, level });
      }
    });

    setToc(parsedHeadings);
  }, [content]);

  return { toc };
};
