import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  contentId?: string;
  className?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({ 
  contentId = 'main-content', 
  className 
}) => {
  const { t } = useTranslation();

  return (
    <a
      href={`#${contentId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground focus:shadow-md focus:top-0 focus:left-0 focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
    >
      {t('common.skipToContent')}
    </a>
  );
};
