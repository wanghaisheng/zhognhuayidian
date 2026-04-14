import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface LearnCenterPageProps {
  initialLearnList?: any[];
}

const LearnCenterPage: React.FC<LearnCenterPageProps> = ({ initialLearnList = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {t('learn.title') || 'Traditional Chinese Medicine Learning Center'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('learn.categories.basics') || 'TCM Basics'}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('learn.categories.basics.desc') || 'Fundamental concepts and theories of Traditional Chinese Medicine'}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {t('learn.start') || 'Start Learning'}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('learn.categories.herbs') || 'Herbal Medicine'}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('learn.categories.herbs.desc') || 'Comprehensive guide to Chinese herbs and formulas'}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {t('learn.start') || 'Start Learning'}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('learn.categories.acupuncture') || 'Acupuncture'}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('learn.categories.acupuncture.desc') || 'Meridian theory and acupuncture techniques'}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {t('learn.start') || 'Start Learning'}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('learn.categories.diagnosis') || 'TCM Diagnosis'}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('learn.categories.diagnosis.desc') || 'Traditional diagnostic methods and techniques'}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {t('learn.start') || 'Start Learning'}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('learn.categories.classics') || 'Classical Texts'}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('learn.categories.classics.desc') || 'Study ancient medical classics and their wisdom'}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {t('learn.start') || 'Start Learning'}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('learn.categories.practice') || 'Clinical Practice'}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('learn.categories.practice.desc') || 'Case studies and clinical applications'}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {t('learn.start') || 'Start Learning'}
              </button>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              {t('learn.featured.title') || 'Featured Courses'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t('learn.featured.course1.title') || 'Introduction to TCM Theory'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('learn.featured.course1.desc') || 'A comprehensive introduction to the fundamental theories of Traditional Chinese Medicine'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {t('learn.featured.course1.duration') || '8 weeks'}
                  </span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    {t('learn.enroll') || 'Enroll Now'}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t('learn.featured.course2.title') || 'Herbal Medicine Fundamentals'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('learn.featured.course2.desc') || 'Learn the principles of Chinese herbal medicine and common formulas'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {t('learn.featured.course2.duration') || '6 weeks'}
                  </span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    {t('learn.enroll') || 'Enroll Now'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
};

export default LearnCenterPage;
