import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { BookOpen, Clock, User, Tag, Calendar, FileText, Star, Bookmark, Share2 } from 'lucide-react'
import { OptimizedImage } from '@/components/atoms/OptimizedImage'
import type { AncientBook } from '@/types/book'

interface BookHeaderProps {
  book: AncientBook
  className?: string
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book, className = '' }) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  
  const bookTitle = book.title[locale] || book.title.zh
  const bookDescription = locale === 'zh' 
    ? `${book.metadata.dynasty}中医古籍《${bookTitle}》，${book.metadata.author}著，包含${book.metadata.chapters}章，约${book.metadata.wordCount}字。`
    : `${book.metadata.dynasty} ancient medical classic "${bookTitle}" by ${book.metadata.author}, containing ${book.metadata.chapters} chapters, approximately ${book.metadata.wordCount} words.`
  
  return (
    <div className={`bg-card rounded-lg p-8 mb-8 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧：封面图片 */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="relative">
            <OptimizedImage
              src={book.metadata.coverImage || '/images/books/default-cover.jpg'}
              alt={bookTitle}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
              loading="lazy"
            />
            {/* 封面装饰 */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20 rounded-lg"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded text-center">
                {book.category}
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：书籍信息 */}
        <div className="flex-1">
          {/* 标题和基本信息 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              {bookTitle}
            </h1>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              {bookDescription}
            </p>
            
            {/* 作者和朝代 */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{book.metadata.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{book.metadata.dynasty}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{book.metadata.publishYear || i18n.t('book.metadata.ancient')}</span>
              </div>
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{book.metadata.chapters}</div>
              <div className="text-sm text-muted-foreground">{i18n.t('book.stats.chapters')}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{book.metadata.wordCount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{i18n.t('book.stats.words')}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Tag className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{book.metadata.tags.length}</div>
              <div className="text-sm text-muted-foreground">{i18n.t('book.stats.tags')}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">4.8</div>
              <div className="text-sm text-muted-foreground">{i18n.t('book.stats.rating')}</div>
            </div>
          </div>
          
          {/* 标签 */}
          {book.metadata.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{i18n.t('book.metadata.tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {book.metadata.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <Bookmark className="h-4 w-4 mr-2" />
              {i18n.t('book.actions.bookmark')}
            </button>
            <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
              <Share2 className="h-4 w-4 mr-2" />
              {i18n.t('book.actions.share')}
            </button>
            <button className="flex items-center px-4 py-2 bg-outline text-foreground rounded-md hover:bg-outline/90 transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              {i18n.t('book.actions.download')}
            </button>
            <Link 
              to={`/library?category=${book.category}`}
              className="flex items-center px-4 py-2 bg-outline text-foreground rounded-md hover:bg-outline/90 transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {i18n.t('book.actions.similar')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
