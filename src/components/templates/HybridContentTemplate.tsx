import React from 'react';
import { HybridContent, DatabaseDevice } from '../../hooks/useHybridContent';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { ErrorMessage } from '../atoms/ErrorMessage';
import SEOHead from '@/components/molecules/SEOHead';
import { useTranslation } from 'react-i18next';

interface HybridContentTemplateProps {
  content: HybridContent | null;
  loading: boolean;
  error: string | null;
  children: (content: HybridContent) => React.ReactNode;
  className?: string;
  structuredData?: object | object[];
  disableSEOHead?: boolean;
}

export const HybridContentTemplate: React.FC<HybridContentTemplateProps> = ({
  content,
  loading,
  error,
  children,
  className = '',
  structuredData,
  disableSEOHead = false
}) => {
  const { t } = useTranslation();
  // 加载状态
  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-64 ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  // 内容未找到
  if (!content) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <ErrorMessage message={t('common.contentNotFound')} />
      </div>
    );
  }

  // Generate structured data
  const generatedSchemas: object[] = [];
  
  if (content.contentType === 'device' && content.databaseContent) {
    generatedSchemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": (content.databaseContent as DatabaseDevice).name,
      "description": content.seoData.description,
      "manufacturer": {
        "@type": "Organization",
        "name": (content.databaseContent as DatabaseDevice).manufacturer_name
      },
      "category": "Medical Equipment"
    });
  }

  if (content.contentType === 'comparison') {
    generatedSchemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": content.seoData.title,
      "description": content.seoData.description,
      "articleSection": "Product Comparison"
    });
  }

  // Combine with passed structuredData
  const finalStructuredData = [
    ...generatedSchemas,
    ...(structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [])
  ];

  return (
    <>
      {!disableSEOHead && (
        <SEOHead 
          title={content.seoData.title}
          description={content.seoData.description}
          keywords={content.seoData.keywords}
          canonicalUrl={content.seoData.canonical}
          ogType="article"
          structuredData={finalStructuredData}
        />
      )}

      {/* 渲染内容 */}
      <div className={className}>
        {children(content)}
      </div>
    </>
  );
};

// 设备详情页专用模板
export const DeviceHybridTemplate: React.FC<{
  content: HybridContent | null;
  loading: boolean;
  error: string | null;
  children: (content: HybridContent) => React.ReactNode;
}> = (props) => {
  return (
    <HybridContentTemplate
      {...props}
      className="device-detail-page"
    />
  );
};

// 对比页面专用模板
export const ComparisonHybridTemplate: React.FC<{
  content: HybridContent | null;
  loading: boolean;
  error: string | null;
  children: (content: HybridContent) => React.ReactNode;
}> = (props) => {
  return (
    <HybridContentTemplate
      {...props}
      className="comparison-page"
    />
  );
};

// 教育内容专用模板
export const EducationContentTemplate: React.FC<{
  content: HybridContent | null;
  loading: boolean;
  error: string | null;
  children: (content: HybridContent) => React.ReactNode;
}> = (props) => {
  return (
    <HybridContentTemplate
      {...props}
      className="education-page"
    />
  );
};
