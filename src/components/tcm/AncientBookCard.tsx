import React from 'react'
import { BookOpen, Calendar, User, Tag } from 'lucide-react'

interface AncientBookCardProps {
  title: string
  author: string
  dynasty: string
  year: string
  category: string
  description: string
  tags: string[]
  onRead?: () => void
  className?: string
}

export const AncientBookCard: React.FC<AncientBookCardProps> = ({
  title,
  author,
  dynasty,
  year,
  category,
  description,
  tags,
  onRead,
  className = ''
}) => {
  return (
    <div className={`ancient-book-item ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-foreground flex-1 mr-2">{title}</h3>
        <span className="dynasty-tag whitespace-nowrap">{dynasty}</span>
      </div>
      
      <div className="text-sm text-muted-foreground mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3" />
          <span>作者：{author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>成书年代：{year}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-3 h-3" />
          <span>分类：<span className="tcm-tag">{category}</span></span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="tcm-tag text-xs">
            {tag}
          </span>
        ))}
      </div>
      
      <button 
        onClick={onRead}
        className="scroll-btn w-full"
      >
        <BookOpen className="w-4 h-4 mr-2 inline" />
        阅读古籍
      </button>
    </div>
  )
}
