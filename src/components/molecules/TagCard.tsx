
import React from 'react';
import LangLink from '@/components/molecules/LangLink';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface TagItem {
  id: string;
  name: string;
  category: 'country' | 'specialty' | 'technology' | 'market_position' | 'certification' | 'product_type';
  count: number;
  description: string;
}

interface TagCardProps {
  tag: TagItem;
  linkTo: string;
}

const TagCard: React.FC<TagCardProps> = ({ tag, linkTo }) => {
  const { t } = useTranslation();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'country':
        return 'bg-blue-100 text-blue-800';
      case 'specialty':
        return 'bg-green-100 text-green-800';
      case 'technology':
        return 'bg-purple-100 text-purple-800';
      case 'market_position':
        return 'bg-orange-100 text-orange-800';
      case 'certification':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: string) => t(`molecules.tagCard.categories.${category}`);

  return (
    <LangLink to={linkTo}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">{tag.name}</h3>
            <Badge className={getCategoryColor(tag.category)}>
              {getCategoryName(tag.category)}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-2">{tag.description}</p>
          <div className="text-right">
            <span className="text-sm font-semibold text-blue-600">{t('molecules.tagCard.itemsCount', { count: tag.count })}</span>
          </div>
        </CardContent>
      </Card>
    </LangLink>
  );
};

export default TagCard;
