import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrandIcon, SimpleIcon } from '../atoms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MEDICAL_BRANDS as medicalBrands } from '@/config/constants';

const commonTechIcons = ['ct', 'mri', 'hospital', 'clinic', 'settings', 'user'];

const IconShowcase: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('examples.iconShowcase.brandIconsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {medicalBrands.map((brand) => (
              <div key={brand} className="flex flex-col items-center space-y-2">
                <BrandIcon brand={brand} size="lg" variant="outlined" />
                <span className="text-xs text-gray-600 text-center">{brand}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('examples.iconShowcase.techIconsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {commonTechIcons.map((icon) => (
              <div key={icon} className="flex flex-col items-center space-y-2">
                <SimpleIcon iconName={icon} size="lg" />
                <span className="text-xs text-gray-600 text-center">{icon}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('examples.iconShowcase.sizeExamplesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center space-y-2">
              <BrandIcon brand="Siemens" size="sm" />
              <span className="text-xs">{t('examples.iconShowcase.sizeLabels.sm')}</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <BrandIcon brand="Siemens" size="md" />
              <span className="text-xs">{t('examples.iconShowcase.sizeLabels.md')}</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <BrandIcon brand="Siemens" size="lg" />
              <span className="text-xs">{t('examples.iconShowcase.sizeLabels.lg')}</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <BrandIcon brand="Siemens" size="xl" />
              <span className="text-xs">{t('examples.iconShowcase.sizeLabels.xl')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('examples.iconShowcase.styleExamplesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center space-y-2">
              <BrandIcon brand="Philips" size="lg" variant="default" />
              <span className="text-xs">{t('examples.iconShowcase.styleLabels.default')}</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <BrandIcon brand="Philips" size="lg" variant="outlined" />
              <span className="text-xs">{t('examples.iconShowcase.styleLabels.outlined')}</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <BrandIcon brand="Philips" size="lg" variant="filled" />
              <span className="text-xs">{t('examples.iconShowcase.styleLabels.filled')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconShowcase;
export { IconShowcase };
