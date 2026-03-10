import * as React from 'react';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/molecules/SEOHead';

const LearnDetailPage: React.FC = () => {
  const { slug } = useParams({ from: '/learn/$slug' });
  const { t } = useTranslation();

  // This would typically fetch content based on the slug
  const courseContent = {
    title: t(`learn.courses.${slug}.title`) || `Course: ${slug}`,
    description: t(`learn.courses.${slug}.description`) || 'Course description not available',
    content: t(`learn.courses.${slug}.content`) || 'Course content will be displayed here.'
  };

  return (
    <>
      <SEOHead 
        title={courseContent.title}
        description={courseContent.description}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <nav className="text-sm text-gray-600 mb-4">
              <a href="/learn" className="hover:text-blue-600">
                {t('learn.back') || 'Back to Learning Center'}
              </a>
              {' > '}
              <span className="text-gray-900">{courseContent.title}</span>
            </nav>
            
            <h1 className="text-4xl font-bold mb-4">{courseContent.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{courseContent.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-4">
                {t('learn.course.overview') || 'Course Overview'}
              </h2>
              <div className="text-gray-700 mb-8">
                {courseContent.content}
              </div>

              <h3 className="text-xl font-semibold mb-4">
                {t('learn.course.objectives') || 'Learning Objectives'}
              </h3>
              <ul className="list-disc pl-6 mb-8 text-gray-700">
                <li>{t('learn.course.objective1') || 'Understand fundamental concepts'}</li>
                <li>{t('learn.course.objective2') || 'Learn practical applications'}</li>
                <li>{t('learn.course.objective3') || 'Master key techniques'}</li>
                <li>{t('learn.course.objective4') || 'Apply knowledge in clinical settings'}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">
                {t('learn.course.modules') || 'Course Modules'}
              </h3>
              <div className="space-y-4 mb-8">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {t('learn.course.module1.title') || 'Module 1: Introduction'}
                  </h4>
                  <p className="text-gray-600">
                    {t('learn.course.module1.desc') || 'Basic concepts and foundations'}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {t('learn.course.module2.title') || 'Module 2: Core Principles'}
                  </h4>
                  <p className="text-gray-600">
                    {t('learn.course.module2.desc') || 'Deep dive into essential theories'}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {t('learn.course.module3.title') || 'Module 3: Practical Applications'}
                  </h4>
                  <p className="text-gray-600">
                    {t('learn.course.module3.desc') || 'Hands-on practice and case studies'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t('learn.course.enrollment') || 'Enrollment Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">
                      {t('learn.course.duration') || 'Duration'}
                    </p>
                    <p className="font-semibold">
                      {t('learn.course.duration.value') || '8 weeks'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t('learn.course.level') || 'Level'}
                    </p>
                    <p className="font-semibold">
                      {t('learn.course.level.value') || 'Beginner to Intermediate'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t('learn.course.format') || 'Format'}
                    </p>
                    <p className="font-semibold">
                      {t('learn.course.format.value') || 'Online + Self-paced'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t('learn.course.certificate') || 'Certificate'}
                    </p>
                    <p className="font-semibold">
                      {t('learn.course.certificate.value') || 'Certificate of Completion'}
                    </p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full md:w-auto">
                  {t('learn.enroll') || 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnDetailPage;
