import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrendBadgeProps {
  trend: number | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({
  trend,
  label,
  size = 'md',
  showIcon = true,
  className
}) => {
  const getTrendInfo = () => {
    const numericTrend = typeof trend === 'string' ? parseFloat(trend.replace(/[^-\d.]/g, '')) : trend;
    
    if (numericTrend > 0) {
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        prefix: '+'
      };
    } else if (numericTrend < 0) {
      return {
        icon: TrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        prefix: ''
      };
    } else {
      return {
        icon: Minus,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 border-gray-200',
        prefix: ''
      };
    }
  };

  const trendInfo = getTrendInfo();
  const Icon = trendInfo.icon;

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

  const displayText = typeof trend === 'string' ? trend : `${trendInfo.prefix}${Math.abs(trend)}%`;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        trendInfo.bgColor,
        trendInfo.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {displayText}
      {label && ` ${label}`}
    </Badge>
  );
};

export default TrendBadge;