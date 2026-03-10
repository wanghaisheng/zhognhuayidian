import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/molecules/SEOHead';

const TermsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead 
        title={t('terms.seo.title') as string}
        description={t('terms.seo.description') as string}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {t('terms.title') || 'Terms of Service'}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('terms.acceptance.title') || 'Acceptance of Terms'}
              </h2>
              <p className="text-gray-600">
                {t('terms.acceptance.content') || 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('terms.use.title') || 'Use License'}
              </h2>
              <p className="text-gray-600">
                {t('terms.use.content') || 'Permission is granted to temporarily download one copy of the materials on Zhonghua Yidian for personal, non-commercial transitory viewing only.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('terms.disclaimer.title') || 'Disclaimer'}
              </h2>
              <p className="text-gray-600">
                {t('terms.disclaimer.content') || 'The materials on Zhonghua Yidian are provided on an \'as is\' basis. Zhonghua Yidian makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('terms.limitations.title') || 'Limitations'}
              </h2>
              <p className="text-gray-600">
                {t('terms.limitations.content') || 'In no event shall Zhonghua Yidian or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Zhonghua Yidian.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('terms.privacy.title') || 'Privacy Policy'}
              </h2>
              <p className="text-gray-600">
                {t('terms.privacy.content') || 'Your Privacy Policy governs the use of this website and all products and services offered by Zhonghua Yidian.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('terms.contact.title') || 'Contact Information'}
              </h2>
              <p className="text-gray-600">
                {t('terms.contact.content') || 'Questions about the Terms of Service should be sent to us at contact@zhonghuayidian.com'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
