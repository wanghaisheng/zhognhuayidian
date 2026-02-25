import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Clock, Bookmark, Share2, Download } from 'lucide-react'
import { BookHeader } from '../molecules/BookHeader'
import { ContentViewer } from '../molecules/ContentViewer'
import { ReadingTools } from '../molecules/ReadingTools'
import { useReadingProgress, useBookmarks, useNotes } from '@/hooks/useBookData'
import type { AncientBook, Chapter } from '@/types/book'

interface ChapterDetailPageProps {
  book: AncientBook
  chapter: Chapter
}

export const ChapterDetailPage: React.FC<ChapterDetailPageProps> = ({ book, chapter }) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  
  const [readingMode, setReadingMode] = useState<'original' | 'translation' | 'interpretation'>('original')
  const { progress, updateProgress } = useReadingProgress(book.id)
  const { bookmarks, addBookmark } = useBookmarks(book.id)
  const { notes, addNote } = useNotes(book.id)
  
  const bookTitle = book.title[locale] || book.title.zh
  const chapterTitle = chapter.title[locale] || chapter.title.zh
  
  // 计算章节进度
  const chapterIndex = book.chapters.findIndex(c => c.id === chapter.id)
  const chapterProgress = chapterIndex / book.chapters.length
  
  const handleBookmark = () => {
    addBookmark({
      chapterId: chapter.id,
      sectionId: chapter.sections[0]?.id || '',
      position: 0,
      note: `${chapterTitle} - 书签`
    })
  }
  
  const handleNote = () => {
    addNote({
      chapterId: chapter.id,
      sectionId: chapter.sections[0]?.id || '',
      content: '',
      range: { start: 0, end: 100, text: chapterTitle }
    })
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${chapterTitle} - ${bookTitle}`,
        text: `分享《${bookTitle}》中的${chapterTitle}`,
        url: window.location.href
      })
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(window.location.href)
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* 返回导航 */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to={`/book/${book.id}`}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {bookTitle}
            </Link>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title={i18n.t('book.actions.bookmark')}
              >
                <Bookmark className="h-4 w-4" />
              </button>
              <button
                onClick={handleNote}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title={i18n.t('book.actions.note')}
              >
                <BookOpen className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title={i18n.t('book.actions.share')}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title={i18n.t('book.actions.download')}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 章节标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{chapterTitle}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {i18n.t('book.chapterInfo.chapter')} {chapterIndex + 1} / {book.chapters.length}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {i18n.t('book.chapterInfo.readingTime')} {Math.ceil(chapter.sections.length * 3)} {i18n.t('book.chapterInfo.minutes')}
            </span>
          </div>
        </div>
        
        {/* 阅读工具栏 */}
        <div className="mb-6">
          <ReadingTools
            readingMode={readingMode}
            onModeChange={setReadingMode}
            chapter={chapter}
            book={book}
          />
        </div>
        
        {/* 内容查看器 */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-8">
            <ContentViewer 
              book={book}
              chapter={chapter}
              readingMode={readingMode}
              onProgressUpdate={(sectionIndex) => {
                const newProgress = (chapterIndex + sectionIndex / chapter.sections.length) / book.chapters.length
                updateProgress(newProgress)
              }}
            />
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-4">
            {/* 章节导航 */}
            <div className="bg-card rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">{i18n.t('book.chapterNavigation.title')}</h3>
              <nav className="space-y-2">
                {chapter.sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="block p-2 rounded hover:bg-muted transition-colors text-sm"
                  >
                    <div className="font-medium">{section.title}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {i18n.t('book.chapterNavigation.section')} {index + 1}
                    </div>
                  </a>
                ))}
              </nav>
            </div>
            
            {/* 关键概念 */}
            {chapter.keyConcepts.length > 0 && (
              <div className="bg-card rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{i18n.t('book.keyConcepts.title')}</h3>
                <div className="space-y-3">
                  {chapter.keyConcepts.map((concept) => (
                    <div key={concept.id} className="border-l-2 border-primary pl-4">
                      <div className="font-medium text-sm">{concept.term}</div>
                      <div className="text-muted-foreground text-xs mt-1">{concept.description}</div>
                      {concept.relatedConcepts.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground mb-1">
                            {i18n.t('book.keyConcepts.related')}:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {concept.relatedConcepts.map((related) => (
                              <span 
                                key={related}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                              >
                                {related}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 阅读统计 */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{i18n.t('book.readingStats.title')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.readingStats.progress')}</dt>
                  <dd className="font-medium">{Math.round(chapterProgress * 100)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.readingStats.bookmarks')}</dt>
                  <dd className="font-medium">{bookmarks.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{i18n.t('book.readingStats.notes')}</dt>
                  <dd className="font-medium">{notes.length}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 章节导航 */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            {chapterIndex > 0 && (
              <Link 
                to={`/book/${book.id}/chapter/${book.chapters[chapterIndex - 1].id}`}
                className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {i18n.t('book.navigation.previous')} - {book.chapters[chapterIndex - 1].title[locale]}
              </Link>
            )}
            
            {chapterIndex < book.chapters.length - 1 && (
              <Link 
                to={`/book/${book.id}/chapter/${book.chapters[chapterIndex + 1].id}`}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ml-auto"
              >
                {i18n.t('book.navigation.next')} - {book.chapters[chapterIndex + 1].title[locale]}
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
