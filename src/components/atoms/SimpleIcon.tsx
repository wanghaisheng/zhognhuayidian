import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleIconProps {
  iconName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

const SimpleIcon: React.FC<SimpleIconProps> = ({
  iconName,
  size = 'md',
  className,
  color = 'currentColor'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  // 动态导入 Simple Icons
  const [iconSvg, setIconSvg] = React.useState<string>('');

  React.useEffect(() => {
    const loadIcon = async () => {
      try {
        const { default: icons } = await import('simple-icons');
        const icon = icons[iconName as keyof typeof icons];
        if (icon) {
          setIconSvg(icon.svg);
        }
      } catch (error) {
        console.warn(`Icon "${iconName}" not found in simple-icons`);
      }
    };

    loadIcon();
  }, [iconName]);

  if (!iconSvg) {
    return (
      <div className={cn(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        className
      )}>
        <div className="animate-pulse bg-gray-300 rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      dangerouslySetInnerHTML={{
        __html: iconSvg.replace(/fill="[^"]*"/g, `fill="${color}"`)
      }}
    />
  );
};

export default SimpleIcon;
export { SimpleIcon };