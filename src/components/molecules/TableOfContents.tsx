import React, { useEffect, useState } from 'react';
import { TableOfContentsItem } from '@/hooks/useTableOfContents';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  toc: TableOfContentsItem[];
  className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc, className }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className={cn("space-y-2", className)}>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 px-2">
        On This Page
      </h3>
      <ul className="space-y-1 text-sm border-l border-gray-200 dark:border-gray-800">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block py-1 pr-4 transition-colors border-l-2 -ml-[1px] text-left",
                activeId === item.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300"
              )}
              style={{ paddingLeft: `${Math.max(0, item.level - 2) * 1 + 1}rem` }}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  const offset = 100; // Header offset
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                  });
                  setActiveId(item.id);
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
