import * as React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {t('about.title')}
        </h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            {t('about.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                {t('about.mission')}
              </h2>
              <p>
                {t('about.missionDescription')}
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                {t('about.vision')}
              </h2>
              <p>
                {t('about.visionDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
