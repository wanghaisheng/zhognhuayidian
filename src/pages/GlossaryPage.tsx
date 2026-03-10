import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/molecules/SEOHead';

const GlossaryPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample glossary data - in a real app this would come from a data source
  const glossaryTerms = [
    {
      term: '气 (Qi)',
      category: 'basic',
      definition: 'Vital energy or life force that flows through the body',
      pronunciation: 'Chee'
    },
    {
      term: '阴阳 (Yin-Yang)',
      category: 'basic',
      definition: 'Opposing but complementary forces that make up all aspects of life',
      pronunciation: 'Yin-Yang'
    },
    {
      term: '五行 (Five Elements)',
      category: 'theory',
      definition: 'Wood, Fire, Earth, Metal, Water - the five fundamental elements',
      pronunciation: 'Wu Xing'
    },
    {
      term: '经络 (Meridians)',
      category: 'anatomy',
      definition: 'Pathways through which Qi flows in the body',
      pronunciation: 'Jing Luo'
    },
    {
      term: '穴位 (Acupoints)',
      category: 'treatment',
      definition: 'Specific points on meridians where Qi can be accessed',
      pronunciation: 'Xue Wei'
    },
    {
      term: '脉诊 (Pulse Diagnosis)',
      category: 'diagnosis',
      definition: 'Method of diagnosing by feeling the pulse at different positions',
      pronunciation: 'Mai Zhen'
    }
  ];

  const categories = [
    { value: 'all', label: t('glossary.categories.all') || 'All Categories' },
    { value: 'basic', label: t('glossary.categories.basic') || 'Basic Concepts' },
    { value: 'theory', label: t('glossary.categories.theory') || 'Theories' },
    { value: 'anatomy', label: t('glossary.categories.anatomy') || 'Anatomy' },
    { value: 'treatment', label: t('glossary.categories.treatment') || 'Treatments' },
    { value: 'diagnosis', label: t('glossary.categories.diagnosis') || 'Diagnosis' }
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEOHead 
        title={t('glossary.seo.title') as string || 'TCM Glossary'}
        description={t('glossary.seo.description') as string || 'Comprehensive glossary of Traditional Chinese Medicine terms'}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {t('glossary.title') || 'Traditional Chinese Medicine Glossary'}
          </h1>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('glossary.search') || 'Search Terms'}
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('glossary.search.placeholder') || 'Search for terms...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('glossary.category') || 'Category'}
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {term.term}
                  </h3>
                  <p className="text-sm text-gray-500 italic">
                    {t('glossary.pronunciation') || 'Pronunciation'}: {term.pronunciation}
                  </p>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                    {categories.find(cat => cat.value === term.category)?.label}
                  </span>
                </div>
                <p className="text-gray-700">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {t('glossary.no-results') || 'No terms found matching your search criteria.'}
              </p>
            </div>
          )}

          <div className="mt-12 bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t('glossary.about.title') || 'About TCM Terminology'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                {t('glossary.about.content1') || 'Traditional Chinese Medicine has a rich vocabulary that reflects thousands of years of medical practice and philosophical development. Understanding these terms is essential for anyone studying or practicing TCM.'}
              </p>
              <p className="mb-4">
                {t('glossary.about.content2') || 'Many TCM terms have no direct equivalent in Western medicine, as they describe concepts and phenomena that are unique to the Chinese medical system. This glossary aims to provide clear, accessible definitions while preserving the depth and nuance of the original concepts.'}
              </p>
              <div className="bg-white rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  {t('glossary.about.tip.title') || 'Tip for Learners'}
                </h3>
                <p>
                  {t('glossary.about.tip.content') || 'When learning TCM terminology, focus on understanding the concepts rather than memorizing definitions. Many terms are interconnected and form a comprehensive system of understanding health and disease.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlossaryPage;
