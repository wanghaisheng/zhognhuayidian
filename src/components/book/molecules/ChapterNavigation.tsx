import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronDown, BookOpen, Clock, CheckCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Chapter } from '@/types/book'

interface ChapterNavigationProps {
  chapters: Chapter[]
  currentChapterId?: string
  onChapterChange: (chapterId: string) => void
  className?: string
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  currentChapterId,
  onChapterChange,
  className = ''
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  // 按类别分组章节
  const chaptersByCategory = chapters.reduce((acc, chapter) => {
    const category = chapter.id.split('-')[0] || 'default'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(chapter)
    return acc
  }, {} as Record<string, Chapter[]>)
  
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }
  
  const getChapterProgress = (chapterId: string) => {
    const index = chapters.findIndex(c => c.id === chapterId)
    return index >= 0 ? (index + 1) / chapters.length : 0
  }
  
  const isChapterCompleted = (chapterId: string) => {
    const progress = getChapterProgress(chapterId)
    return progress >= 1
  }
  
  return (
    <div className={`bg-card rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BookOpen className="h-5 w-5 mr-2" />
        {i18n.t('book.navigation.chapters')}
      </h3>
      
      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={i18n.t('book.navigation.searchPlaceholder')}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      {/* 章节列表 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(chaptersByCategory).map(([category, categoryChapters]) => (
          <div key={category} className="border-b border-border last:border-b-0">
            {/* 分类标题 */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center">
                <ChevronRight 
                  className={`h-4 w-4 mr-2 transition-transform ${
                    expandedCategories.has(category) ? 'rotate-90' : ''
                  }`}
                />
                <span className="font-medium">
                  {i18n.t(`book.categories.${category}`)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {categoryChapters.length} {i18n.t('book.navigation.chapters')}
              </span>
            </button>
            
            {/* 章节列表 */}
            {expandedCategories.has(category) && (
              <div className="ml-4 space-y-1">
                {categoryChapters.map((chapter) => {
                  const isActive = currentChapterId === chapter.id
                  const isCompleted = isChapterCompleted(chapter.id)
                  const progress = getChapterProgress(chapter.id)
                  const chapterTitle = chapter.title[locale] || chapter.title.zh
                  
                  return (
                    <Link
                      key={chapter.id}
                      to={`/book/${chapters[0].id.split('-')[0]}/chapter/${chapter.id}`}
                      onClick={() => onChapterChange(chapter.id)}
                      className={`block p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium truncate">{chapterTitle}</div>
                            <div className="text-xs text-muted-foreground">
                              {i18n.t('book.navigation.chapter')} {chapter.order + 1}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.round(chapter.sections.length * 3)} {i18n.t('book.navigation.minutes')}
                        </div>
                      </div>
                      
                      {/* 进度条 */}
                      {!isActive && progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-muted rounded-full h-1">
                            <div 
                              className="bg-primary h-1 rounded-full transition-all duration-300"
                              style={{ width: `${progress * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 快速跳转 */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground mb-2">
          {i18n.t('book.navigation.quickJump')}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const firstIncomplete = chapters.find(c => !isChapterCompleted(c.id))
              if (firstIncomplete) {
                onChapterChange(firstIncomplete.id)
              }
            }}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm"
          >
            {i18n.t('book.navigation.continueReading')}
          </button>
          <button
            onClick={() => {
              onChapterChange(chapters[0].id)
            }}
            className="px-3 py-2 bg-outline text-foreground rounded-md hover:bg-outline/90 transition-colors text-sm"
          >
            {i18n.t('book.navigation.startOver')}
          </button>
        </div>
      </div>
      
      {/* 阅读统计 */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {i18n.t('book.navigation.readingProgress')}
          </span>
          <span className="font-medium">
            {Math.round((chapters.filter(c => isChapterCompleted(c.id)).length / chapters.length) * 100)}%
          </span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(chapters.filter(c => isChapterCompleted(c.id)).length / chapters.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
