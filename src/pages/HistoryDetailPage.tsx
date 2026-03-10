import * as React from 'react';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/molecules/SEOHead';

const HistoryDetailPage: React.FC = () => {
  const { slug } = useParams({ from: '/history/$slug' });
  const { t } = useTranslation();

  // Sample history content - in a real app this would be fetched based on the slug
  const historyContent = {
    'yellow-emperor': {
      title: t('history.yellow-emperor.title') || 'Yellow Emperor\'s Era',
      period: t('history.yellow-emperor.period') || 'c. 2698–2598 BCE',
      description: t('history.yellow-emperor.description') || 'The legendary beginning of Traditional Chinese Medicine',
      content: t('history.yellow-emperor.content') || 'The Yellow Emperor (Huangdi) is credited with writing the Huangdi Neijing (Yellow Emperor\'s Inner Canon), one of the oldest and most important medical texts in Chinese history.'
    },
    'han-dynasty': {
      title: t('history.han-dynasty.title') || 'Han Dynasty Development',
      period: t('history.han-dynasty.period') || '206 BCE – 220 CE',
      description: t('history.han-dynasty.description') || 'Systematization of medical knowledge',
      content: t('history.han-dynasty.content') || 'During the Han Dynasty, medical knowledge was systematically organized and documented. Zhang Zhongjing wrote the Shang Han Za Bing Lun, which became a foundational text for clinical practice.'
    },
    'tang-dynasty': {
      title: t('history.tang-dynasty.title') || 'Tang Dynasty Golden Age',
      period: t('history.tang-dynasty.period') || '618–907 CE',
      description: t('history.tang-dynasty.description') || 'Medical education and international influence',
      content: t('history.tang-dynasty.content') || 'The Tang Dynasty saw the establishment of the Imperial Medical College and the spread of Chinese medical knowledge to neighboring countries.'
    }
  };

  const content = historyContent[slug as keyof typeof historyContent] || {
    title: t('history.default.title') || 'Historical Period',
    period: t('history.default.period') || 'Period information not available',
    description: t('history.default.description') || 'Description not available',
    content: t('history.default.content') || 'Content not available'
  };

  return (
    <>
      <SEOHead 
        title={content.title}
        description={content.description}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <nav className="text-sm text-gray-600 mb-4">
              <a href="/history" className="hover:text-blue-600">
                {t('history.back') || 'Back to History'}
              </a>
              {' > '}
              <span className="text-gray-900">{content.title}</span>
            </nav>
            
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
              <p className="text-xl text-gray-600">{content.period}</p>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">{content.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-6">
                {t('history.overview') || 'Overview'}
              </h2>
              <div className="text-gray-700 mb-8 leading-relaxed">
                {content.content}
              </div>

              <h3 className="text-xl font-semibold mb-4">
                {t('history.key-developments') || 'Key Developments'}
              </h3>
              <ul className="list-disc pl-6 mb-8 text-gray-700 space-y-2">
                <li>{t('history.development1') || 'Advancement in medical theory and practice'}</li>
                <li>{t('history.development2') || 'Compilation of medical texts and pharmacopoeias'}</li>
                <li>{t('history.development3') || 'Establishment of medical education institutions'}</li>
                <li>{t('history.development4') || 'International exchange of medical knowledge'}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">
                {t('history.legacy') || 'Legacy and Influence'}
              </h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700">
                  {t('history.legacy.content') || 'This period laid the foundation for many aspects of Traditional Chinese Medicine that continue to influence practice today. The theories, diagnostic methods, and treatment principles developed during this time remain central to TCM education and clinical practice.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {t('history.notable-figures') || 'Notable Figures'}
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {t('history.figure1') || 'Huangdi (Yellow Emperor)'}</li>
                    <li>• {t('history.figure2') || 'Zhang Zhongjing'}</li>
                    <li>• {t('history.figure3') || 'Hua Tuo'}</li>
                    <li>• {t('history.figure4') || 'Sun Simiao'}</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {t('history.key-texts') || 'Key Medical Texts'}
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {t('history.text1') || 'Huangdi Neijing'}</li>
                    <li>• {t('history.text2') || 'Shang Han Lun'}</li>
                    <li>• {t('history.text3') || 'Jin Gui Yao Lue'}</li>
                    <li>• {t('history.text4') || 'Bei Ji Qian Jin Yao Fang'}</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t('history.modern-relevance') || 'Modern Relevance'}
                </h3>
                <p className="text-gray-700">
                  {t('history.modern-relevance.content') || 'The medical wisdom from this period continues to inform modern TCM practice. Many contemporary practitioners study these ancient texts to deepen their understanding of traditional healing methods and to integrate this knowledge with modern medical approaches.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center">
              <a href="/history" className="text-blue-600 hover:text-blue-800">
                ← {t('history.back-to-list') || 'Back to History Timeline'}
              </a>
              <div className="space-x-4">
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                  {t('history.share') || 'Share'}
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  {t('history.learn-more') || 'Learn More'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryDetailPage;
