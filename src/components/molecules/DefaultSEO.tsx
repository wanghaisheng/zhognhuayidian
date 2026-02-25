import React from 'react';
import SEOHead from '@/components/molecules/SEOHead';

/**
 * Default SEO component that ensures every page has a canonical URL and hreflang tags.
 * This should be placed in the main App layout.
 * Individual pages can override these settings by using SEOHead or Helmet directly.
 */
const DefaultSEO = () => {
  return <SEOHead />;
};

export default DefaultSEO;
