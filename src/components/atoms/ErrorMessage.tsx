import React from 'react';
import { AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  variant = 'error',
  size = 'md',
  showIcon = true,
  className
}) => {
  const variantConfig = {
    error: {
      icon: XCircle,
      alertVariant: 'destructive' as const,
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertTriangle,
      alertVariant: 'default' as const,
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: AlertCircle,
      alertVariant: 'default' as const,
      iconColor: 'text-blue-500'
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

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

  return (
    <Alert 
      variant={config.alertVariant}
      className={cn(
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Icon 
          className={cn(
            iconSizes[size],
            config.iconColor
          )} 
        />
      )}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
export { ErrorMessage };