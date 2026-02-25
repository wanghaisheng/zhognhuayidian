import React from 'react';
import { CheckCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface SuccessMessageProps {
  title?: string;
  message: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  showIcon?: boolean;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  size = 'md',
  variant = 'default',
  showIcon = true,
  className
}) => {
  const Icon = variant === 'minimal' ? Check : CheckCircle;

  const sizeClasses = {
    sm: 'text-sm p-3',
    md: 'text-base p-4',
    lg: 'text-lg p-5'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantClasses = {
    default: 'border-green-200 bg-green-50 text-green-800',
    minimal: 'border-green-200 bg-white text-green-700'
  };

  return (
    <Alert 
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {showIcon && (
        <Icon 
          className={cn(
            iconSizes[size],
            'text-green-600'
          )} 
        />
      )}
      {title && <AlertTitle className="text-green-800">{title}</AlertTitle>}
      <AlertDescription className="text-green-700">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default SuccessMessage;
export { SuccessMessage };