import * as React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * 语义化标题组件 - SEO 优化
 * 使用正确的 H 标签层级，同时保持统一的视觉样式
 */
export const Heading = ({ level, children, className, id }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  // 语义化的样式映射 - 使用设计系统的 HSL 颜色
  const styles = {
    1: "text-4xl md:text-5xl font-bold text-foreground", // 页面主标题
    2: "text-3xl md:text-4xl font-semibold text-foreground", // 主要章节
    3: "text-2xl md:text-3xl font-semibold text-foreground", // 子章节
    4: "text-xl md:text-2xl font-medium text-foreground/90",
    5: "text-lg md:text-xl font-medium text-foreground/90",
    6: "text-base md:text-lg font-medium text-foreground/80"
  };
  
  return (
    <Tag 
      id={id} 
      className={cn(styles[level], className)}
    >
      {children}
    </Tag>
  );
};
