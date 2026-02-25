import * as React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {t('about.title', '关于我们')}
        </h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            {t('about.description', '中国CT扫描仪网是面向买方的CT/MRI信息平台。')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                {t('about.mission', '我们的使命')}
              </h2>
              <p>
                {t('about.missionDescription', '提供可核验的设备参数与真实价格区间，服务中国市场的理性采购。')}
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                {t('about.vision', '我们的愿景')}
              </h2>
              <p>
                {t('about.visionDescription', '成为医疗设备采购领域最值得信赖的信息平台。')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
