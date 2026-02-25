import React from 'react';
import { Activity, Zap, Stethoscope, Scan, Brain, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceIconProps {
  deviceType: 'ct' | 'mri' | 'xray' | 'ultrasound' | 'pet' | 'mammography';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outlined' | 'filled';
  className?: string;
}

const DeviceIcon: React.FC<DeviceIconProps> = ({
  deviceType,
  size = 'md',
  variant = 'default',
  className
}) => {
  const iconMap = {
    ct: Zap,
    mri: Activity,
    xray: Scan,
    ultrasound: Stethoscope,
    pet: Brain,
    mammography: Heart
  };

  const Icon = iconMap[deviceType] || Activity;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    default: 'text-gray-600',
    outlined: 'text-blue-600 border border-blue-200 rounded-full p-2',
    filled: 'text-white bg-blue-600 rounded-full p-2'
  };

  return (
    <div className={cn(
      'inline-flex items-center justify-center',
      variant !== 'default' && 'flex-shrink-0',
      className
    )}>
      <Icon 
        className={cn(
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
    </div>
  );
};

export default DeviceIcon;
export { DeviceIcon };