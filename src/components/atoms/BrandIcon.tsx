import React from 'react';
import { SimpleIcon } from './SimpleIcon';
import { cn } from '@/lib/utils';

interface BrandIconProps {
  brand: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outlined' | 'filled';
  className?: string;
}

const BrandIcon: React.FC<BrandIconProps> = ({
  brand,
  size = 'md',
  variant = 'default',
  className
}) => {
  // 品牌名称到 Simple Icons 名称的映射
  const brandIconMap: Record<string, string> = {
    'siemens': 'siemens',
    'philips': 'philips',
    'ge': 'generalelectric',
    'general electric': 'generalelectric',
    'canon': 'canon',
    'toshiba': 'toshiba',
    'hitachi': 'hitachi',
    'samsung': 'samsung',
    'fujifilm': 'fujifilm',
    'mindray': 'mindray',
    'united imaging': 'ui', // 可能需要自定义
    'neusoft': 'neusoft', // 可能需要自定义
    'wandong': 'wandong', // 可能需要自定义
    'alltech': 'alltech',
    'carestream': 'carestream'
  };

  const iconName = brandIconMap[brand.toLowerCase()];
  
  const variantClasses = {
    default: '',
    outlined: 'border border-gray-200 rounded-lg p-2',
    filled: 'bg-gray-100 rounded-lg p-2'
  };

  // 如果没有找到对应的图标，显示品牌首字母
  if (!iconName) {
    const initials = brand
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    const sizeClasses = {
      sm: 'h-4 w-4 text-xs',
      md: 'h-6 w-6 text-sm',
      lg: 'h-8 w-8 text-base',
      xl: 'h-12 w-12 text-lg'
    };

    return (
      <div className={cn(
        'inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}>
        {initials}
      </div>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center justify-center',
      variantClasses[variant],
      className
    )}>
      <SimpleIcon
        iconName={iconName}
        size={size}
        color="#374151" // 默认灰色
      />
    </div>
  );
};

export default BrandIcon;
export { BrandIcon };