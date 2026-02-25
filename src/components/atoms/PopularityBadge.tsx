import React from 'react';
import { Star, Crown, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface PopularityBadgeProps {
  variant?: 'popular' | 'bestseller' | 'trending';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const PopularityBadge: React.FC<PopularityBadgeProps> = ({
  variant = 'popular',
  size = 'md',
  showIcon = true,
  className
}) => {
  const { t } = useTranslation();

  const variantConfig = {
    popular: {
      icon: Star,
      label: t('pricing.popular') || 'Popular',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    bestseller: {
      icon: Crown,
      label: t('devices.bestseller') || 'Bestseller',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    trending: {
      icon: TrendingUp,
      label: t('devices.trending') || 'Trending',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        config.bgColor,
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
};

export default PopularityBadge;