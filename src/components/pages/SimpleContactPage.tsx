import * as React from 'react';
import { useTranslation } from 'react-i18next';

const SimpleContactPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {t('contact.pageTitle')}
        </h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            {t('contact.pageDescription')}
          </p>
          
          <div className="bg-card p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              联系方式
            </h2>
            <p>
              如有任何问题或建议，欢迎与我们联系。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleContactPage;
