import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { BookOpen, Star, Clock, ChevronRight } from 'lucide-react'
import { OptimizedImage } from '@/components/atoms/OptimizedImage'
import { useRelatedBooks } from '@/hooks/useBookData'
import type { AncientBook, BookCategory } from '@/types/book'

interface RelatedBooksProps {
  bookId: string
  category: BookCategory
  className?: string
}

export const RelatedBooks: React.FC<RelatedBooksProps> = ({
  bookId,
  category,
  className = ''
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  
  const { data: relatedBooks, isLoading, error } = useRelatedBooks(bookId)
  
  if (isLoading) {
    return (
      <div className={`bg-card rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {i18n.t('book.relatedBooks.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
              <div className="w-full h-32 bg-muted-foreground/20 rounded mb-3"></div>
              <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (error || !relatedBooks || relatedBooks.length === 0) {
    return (
      <div className={`bg-card rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {i18n.t('book.relatedBooks.title')}
        </h3>
        <div className="text-center text-muted-foreground py-8">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{i18n.t('book.relatedBooks.noRelated')}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`bg-card rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {i18n.t('book.relatedBooks.title')}
        </h3>
        <Link 
          to={`/library?category=${category}`}
          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center"
        >
          {i18n.t('book.relatedBooks.viewAll')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedBooks.map((book) => {
          const bookTitle = book.title[locale] || book.title.zh
          const bookDescription = locale === 'zh' 
            ? `${book.metadata.dynasty}中医古籍，${book.metadata.author}著`
            : `${book.metadata.dynasty} ancient medical classic by ${book.metadata.author}`
          
          return (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="group block bg-background rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <OptimizedImage
                  src={book.metadata.coverImage || '/images/books/default-cover.jpg'}
                  alt={bookTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded text-center">
                    {book.category}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {bookTitle}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {bookDescription}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    <span>4.8</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{Math.round(book.metadata.chapters * 3)} {i18n.t('book.relatedBooks.minutes')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{book.metadata.author}</span>
                    <span className="mx-1">•</span>
                    <span>{book.metadata.dynasty}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {book.metadata.chapters} {i18n.t('book.relatedBooks.chapters')}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      
      {/* 分类推荐 */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="font-medium text-foreground mb-4">
          {i18n.t('book.relatedBooks.categoryRecommendations')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {['medical-classics', 'materia-medica', 'prescriptions', 'acupuncture'].map((cat) => (
            <Link
              key={cat}
              to={`/library?category=${cat}`}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {i18n.t(`book.categories.${cat}`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
