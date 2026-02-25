import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SpecificationLabelProps {
  label: string;
  value?: string | number;
  unit?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  isKey?: boolean; // Add support for key specification highlighting
  className?: string;
}

const SpecificationLabel: React.FC<SpecificationLabelProps> = ({
  label,
  value,
  unit,
  variant = 'default',
  size = 'md',
  layout = 'horizontal',
  isKey = false,
  className
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const layoutClasses = {
    horizontal: 'flex items-center gap-2',
    vertical: 'flex flex-col gap-1'
  };

  const formatValue = () => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  // If no value is provided, just render the label (for key spec highlighting)
  if (value === undefined) {
    return (
      <span className={cn(
        'font-medium',
        isKey ? 'text-blue-600' : 'text-gray-700',
        sizeClasses[size],
        className
      )}>
        {label}
        {isKey && <span className="ml-1 text-xs text-blue-500">★</span>}
      </span>
    );
  }

  return (
    <div className={cn(
      layoutClasses[layout],
      sizeClasses[size],
      className
    )}>
      <span className={cn(
        'font-medium',
        isKey ? 'text-blue-600' : 'text-gray-600'
      )}>
        {label}:
        {isKey && <span className="ml-1 text-xs text-blue-500">★</span>}
      </span>
      <Badge variant={variant} className={sizeClasses[size]}>
        {formatValue()}
        {unit && ` ${unit}`}
      </Badge>
    </div>
  );
};

export default SpecificationLabel;
export { SpecificationLabel };