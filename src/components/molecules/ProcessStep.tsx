import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  isActive?: boolean;
  isCompleted?: boolean;
  showConnector?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  step,
  title,
  description,
  isActive = false,
  isCompleted = false,
  showConnector = true,
  variant = 'default',
  className
}) => {
  const getStepIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    
    return (
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-600'
      )}>
        {step}
      </div>
    );
  };

  const variantStyles = {
    default: 'p-4',
    compact: 'p-3',
    detailed: 'p-6'
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-start gap-4', className)}>
        <div className="flex-shrink-0">
          {getStepIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        {showConnector && (
          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Card className={cn(
        'transition-all duration-200',
        isActive && 'ring-2 ring-blue-500 ring-opacity-50',
        isCompleted && 'bg-green-50 border-green-200'
      )}>
        <CardContent className={variantStyles[variant]}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getStepIcon()}
            </div>
            <div className="flex-1">
              <h4 className={cn(
                'font-semibold mb-2',
                variant === 'detailed' ? 'text-lg' : 'text-base'
              )}>
                {title}
              </h4>
              <p className={cn(
                'text-gray-600',
                variant === 'detailed' ? 'text-base' : 'text-sm'
              )}>
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showConnector && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
        </div>
      )}
    </div>
  );
};

export default ProcessStep;