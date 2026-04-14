import * as React from 'react';
import { useTranslation } from 'react-i18next';

const HistoryPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {t('history.title') || 'History of Traditional Chinese Medicine'}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('history.ancient.title') || 'Ancient Origins'}
              </h2>
              <p className="text-gray-600">
                {t('history.ancient.content') || 'Traditional Chinese Medicine (TCM) has a history spanning thousands of years, with its origins dating back to the Yellow Emperor\'s Inner Canon (Huangdi Neijing), one of the oldest and most important medical texts in China.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('history.development.title') || 'Development Through Dynasties'}
              </h2>
              <p className="text-gray-600">
                {t('history.development.content') || 'Throughout Chinese history, various dynasties contributed to the development and refinement of TCM theories and practices, including the Han, Tang, Song, and Ming dynasties.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('history.modern.title') || 'Modern Integration'}
              </h2>
              <p className="text-gray-600">
                {t('history.modern.content') || 'In modern times, TCM has gained global recognition and is increasingly integrated with conventional medical practices, offering complementary approaches to health and wellness.'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t('history.principles.title') || 'Core Principles'}
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('history.principles.yin-yang') || 'Yin-Yang Theory - The balance of opposing forces'}</li>
                <li>{t('history.principles.five-elements') || 'Five Elements Theory - Wood, Fire, Earth, Metal, Water'}</li>
                <li>{t('history.principles.qi') || 'Qi - Vital energy flowing through the body'}</li>
                <li>{t('history.principles.meridians') || 'Meridian System - Pathways for energy flow'}</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
};

export default HistoryPage;
