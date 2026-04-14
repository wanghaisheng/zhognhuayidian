import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from '@/components/ui/heading';
import i18n from '@/lib/i18n';
import privacyEn from '@/data/snapshots/en/pages/privacy.json';
import privacyZh from '@/data/snapshots/zh/pages/privacy.json';

type PrivacySnapshot = {
  intro: { content: string };
  dataCollection: { content: string; items?: string[] };
  dataUsage: { content: string; items?: string[] };
  cookies: { content: string };
  security: { content: string };
  contact: { content: string };
};

interface PrivacyPageProps {
  initialPrivacyContent?: PrivacySnapshot;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ initialPrivacyContent }) => {
  const { t } = useTranslation();
  const privacyContent: PrivacySnapshot = initialPrivacyContent || (i18n.language === 'zh' ? (privacyZh as unknown) : (privacyEn as unknown)) as PrivacySnapshot;

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      <div className="container mx-auto px-4 py-8">
        
        <div className="bg-card rounded-lg shadow-sm p-8 max-w-4xl mx-auto mt-8">
          <Heading level={1} className="mb-6 border-b pb-4">
            {t('privacy.title')}
          </Heading>
          
          <div className="prose prose-primary max-w-none text-muted-foreground">
            <p className="mb-4">{t('privacy.lastUpdated')} {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">{t('privacy.intro.title')}</h2>
            <p className="mb-4">{privacyContent.intro.content}</p>

            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">{t('privacy.dataCollection.title')}</h2>
            <p className="mb-4">{privacyContent.dataCollection.content}</p>
            {Array.isArray(privacyContent.dataCollection.items) && privacyContent.dataCollection.items.length > 0 ? (
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {privacyContent.dataCollection.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>{t('privacy.dataCollection.items.identity')}</li>
                <li>{t('privacy.dataCollection.items.contact')}</li>
                <li>{t('privacy.dataCollection.items.technical')}</li>
                <li>{t('privacy.dataCollection.items.usage')}</li>
              </ul>
            )}

            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">{t('privacy.dataUsage.title')}</h2>
            <p className="mb-4">{privacyContent.dataUsage.content}</p>
            {Array.isArray(privacyContent.dataUsage.items) && privacyContent.dataUsage.items.length > 0 ? (
              <ul className="list-disc pl-5 mb-4 space-y-2">
                {privacyContent.dataUsage.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>{t('privacy.dataUsage.items.contract')}</li>
                <li>{t('privacy.dataUsage.items.interest')}</li>
                <li>{t('privacy.dataUsage.items.legal')}</li>
              </ul>
            )}

            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">{t('privacy.cookies.title')}</h2>
            <p className="mb-4">{privacyContent.cookies.content}</p>

            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">{t('privacy.security.title')}</h2>
            <p className="mb-4">{privacyContent.security.content}</p>

            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">{t('privacy.contact.title')}</h2>
            <p className="mb-4">{privacyContent.contact.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
