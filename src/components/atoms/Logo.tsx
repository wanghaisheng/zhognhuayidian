import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ className, variant = 'default' }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 transition-transform group-hover:scale-105",
      className
    )}>
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary",
        variant === 'default' ? "text-white" : "text-white"
      )}>
        <BookOpen className="w-5 h-5" />
      </div>
      <span className={cn(
        "text-xl font-bold",
        variant === 'default' ? "text-foreground" : "text-white"
      )}>
        🏛️
      </span>
    </div>
  );
};

export default Logo;
