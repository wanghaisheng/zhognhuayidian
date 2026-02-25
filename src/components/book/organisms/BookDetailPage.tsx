import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { BookOpen, Clock, User, Tag, ChevronRight } from 'lucide-react'
import { BookHeader } from '@/components/book/molecules/BookHeader'
import { ChapterNavigation } from '@/components/book/molecules/ChapterNavigation'
import { ContentViewer } from '@/components/book/molecules/ContentViewer'
import { RelatedBooks } from '@/components/book/molecules/RelatedBooks'
import { ReadingProgress } from '@/components/book/atoms/ReadingProgress'
import { useReadingProgress, useBookmarks } from '@/hooks/useBookData'
import type { AncientBook } from '@/types/book'

interface BookDetailPageProps {
  book: AncientBook
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ book }) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  const { progress, updateProgress } = useReadingProgress(book.id)
  const { bookmarks } = useBookmarks(book.id)
  
  // 安全检查数据
  if (!book || !book.chapters || book.chapters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {i18n.t('bookDetail.ui.loading') || 'Loading...'}
          </h1>
          <p className="text-muted-foreground">
            {i18n.t('bookDetail.ui.loadingError') || 'Failed to load book data'}
          </p>
        </div>
      </div>
    )
  }
  
  const bookTitle = book.title[locale] || book.title.zh
  const firstChapter = book.chapters[0]
  const bookDescription = locale === 'zh'
    ? `${book.metadata.dynasty}中医古籍《${bookTitle}》，${book.metadata.author}著，包含${book.metadata.chapters}章，约${book.metadata.wordCount}字。`
    : `${book.metadata.dynasty} ancient medical classic "${bookTitle}" by ${book.metadata.author}, containing ${book.metadata.chapters} chapters, approximately ${book.metadata.wordCount} words.`
  
  return (
    <div className="min-h-screen bg-background">
      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            {i18n.t('bookDetail.ui.breadcrumbs.home')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/library" className="hover:text-foreground transition-colors">
            {i18n.t('bookDetail.ui.breadcrumbs.library')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{bookTitle}</span>
        </nav>
        
        {/* 书籍头部信息 */}
        <BookHeader book={book} />
        
        {/* 阅读进度 */}
        {progress && (
          <div className="mb-8">
            <ReadingProgress 
              progress={progress} 
              total={book.metadata.chapters}
            />
          </div>
        )}
        
        {/* 主要内容布局 */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* 左侧：章节导航 */}
          <div className="lg:col-span-3">
            <ChapterNavigation 
              chapters={book.chapters}
              currentChapterId={firstChapter?.id}
              onChapterChange={(chapterId) => {
                // 处理章节切换
                console.log('Switching to chapter:', chapterId)
              }}
            />
            
            {/* 书签列表 */}
            {bookmarks && bookmarks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {i18n.t('book.navigation.bookmarks')}
                </h3>
                <div className="space-y-2">
                  {bookmarks.slice(0, 5).map((bookmark) => (
                    <div 
                      key={bookmark.id}
                      className="p-3 bg-muted rounded-lg text-sm"
                    >
                      <div className="font-medium truncate">
                        {bookmark.note || '无标题书签'}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {new Date(bookmark.createdAt).toLocaleDateString(locale)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 中间：内容查看器 */}
          <div className="lg:col-span-6">
            <ContentViewer 
              book={book}
              chapter={firstChapter}
              onProgressUpdate={updateProgress}
            />
          </div>
          
          {/* 右侧：相关信息 */}
          <div className="lg:col-span-3">
            {/* 书籍元数据 */}
            <div className="bg-card rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                {i18n.t('book.metadata.title')}
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.metadata.dynasty')}</dt>
                  <dd className="font-medium">{book.metadata.dynasty}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.metadata.author')}</dt>
                  <dd className="font-medium">{book.metadata.author}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.metadata.chapters')}</dt>
                  <dd className="font-medium">{book.metadata.chapters}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.metadata.wordCount')}</dt>
                  <dd className="font-medium">{book.metadata.wordCount.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.metadata.category')}</dt>
                  <dd className="font-medium">{i18n.t(`book.categories.${book.category}`)}</dd>
                </div>
              </dl>
            </div>
            
            {/* 标签 */}
            {book.metadata.tags && book.metadata.tags.length > 0 && (
              <div className="bg-card rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{i18n.t('book.metadata.tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {book.metadata.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 阅读统计 */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {i18n.t('book.readingStats.title')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.readingStats.progress')}</dt>
                  <dd className="font-medium">
                    {progress ? `${Math.round(progress * 100)}%` : '0%'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.readingStats.bookmarks')}</dt>
                  <dd className="font-medium">{bookmarks?.length || 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.readingStats.lastRead')}</dt>
                  <dd className="font-medium">
                    {progress ? i18n.t('book.readingStats.today') : i18n.t('book.readingStats.never')}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 相关推荐 */}
        <div className="mt-12">
          <RelatedBooks bookId={book.id} category={book.category} />
        </div>
      </main>
    </div>
  )
}
