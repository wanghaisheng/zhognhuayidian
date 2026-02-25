import React from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'highlighted' | 'muted';
  showCurrency?: boolean;
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'USD',
  size = 'md',
  variant = 'default',
  showCurrency = true,
  className
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toLocaleString();
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const variantClasses = {
    default: 'text-gray-900',
    highlighted: 'text-blue-600 font-bold',
    muted: 'text-gray-500'
  };

  return (
    <span 
      className={cn(
        'font-medium',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {showCurrency && currency === 'USD' && '$'}
      {formatPrice(amount)}
      {showCurrency && currency !== 'USD' && ` ${currency}`}
    </span>
  );
};

export default PriceDisplay;