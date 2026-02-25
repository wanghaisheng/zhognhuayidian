import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BookOpen, Eye, EyeOff, Volume2, Settings, Maximize2, Minimize2, Type } from 'lucide-react'
import { useReadingProgress } from '@/hooks/useBookData'
import type { AncientBook, Chapter, ReadingSettings } from '@/types/book'

interface ContentViewerProps {
  book: AncientBook
  chapter: Chapter
  readingMode?: 'original' | 'translation' | 'interpretation'
  onProgressUpdate?: (sectionIndex: number) => void
  className?: string
}

export const ContentViewer: React.FC<ContentViewerProps> = ({
  book,
  chapter,
  readingMode = 'original',
  onProgressUpdate,
  className = ''
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  const { progress, updateProgress } = useReadingProgress(book.id)
  
  const [fontSize, setFontSize] = useState(16)
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('scroll')
  const [currentReadingMode, setCurrentReadingMode] = useState<'original' | 'translation' | 'interpretation'>((readingMode as 'original' | 'translation' | 'interpretation') || 'original')
  
  const contentRef = useRef<HTMLDivElement>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  
  // 同步外部readingMode的变化 - 但只在初始化时同步
  useEffect(() => {
    if (readingMode && !currentReadingMode) {
      console.log('🔄 Initializing reading mode from external:', readingMode)
      setCurrentReadingMode(readingMode as 'original' | 'translation' | 'interpretation')
    }
  }, [readingMode, currentReadingMode])
  
  // 当内部状态变化时，通知父组件
  useEffect(() => {
    if (onProgressUpdate && currentReadingMode !== readingMode) {
      console.log('📢 Notifying parent of reading mode change:', currentReadingMode)
      // 这里可以添加回调来通知父组件状态变化
    }
  }, [currentReadingMode, readingMode, onProgressUpdate])
  
  // 监听滚动位置，更新阅读进度
  useEffect(() => {
    console.log('🔍 ContentViewer mounted with chapter:', chapter.id, 'sections:', chapter.sections.length)
    console.log('📊 Initial reading mode:', currentReadingMode)
    
    const handleScroll = () => {
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll('[data-section-index]')
        const scrollTop = contentRef.current.scrollTop
        
        // 找到当前可见的章节
        let currentSection = 0
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i] as HTMLElement
          const sectionTop = section.offsetTop
          if (sectionTop <= scrollTop + 100) {
            currentSection = i
          } else {
            break
          }
        }
        
        setCurrentSectionIndex(currentSection)
        onProgressUpdate?.(0)
      }
    }
    
    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      return () => contentElement.removeEventListener('scroll', handleScroll)
    }
  }, [onProgressUpdate])
  
  // 全屏处理
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }
  
  // 字体大小调整
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12))
  }
  
  const resetFontSize = () => {
    setFontSize(16)
  }
  
  // 获取当前内容
  const getCurrentContent = () => {
    console.log('📖 Getting content for mode:', currentReadingMode, 'section:', currentSectionIndex)
    const section = chapter.sections[currentSectionIndex]
    
    let content = ''
    switch (currentReadingMode) {
      case 'original':
        content = section?.originalText || ''
        console.log('📜 Original text length:', content.length, 'first 50 chars:', content.substring(0, 50))
        break
      case 'translation':
        content = section?.translation || ''
        console.log('🔄 Translation length:', content.length, 'first 50 chars:', content.substring(0, 50))
        break
      case 'interpretation':
        content = section?.interpretation || ''
        console.log('💡 Interpretation length:', content.length, 'first 50 chars:', content.substring(0, 50))
        break
      default:
        content = section?.originalText || ''
        console.log('📜 Default (original) text length:', content.length)
    }
    
    return content
  }
  
  const renderContent = () => {
    const content = getCurrentContent()
    
    if (viewMode === 'page') {
      // 分页模式
      return (
        <div className="prose max-w-none">
          {content.split('\n').map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers && (
                <span className="w-8 text-right text-muted-foreground text-sm mr-4 select-none">
                  {index + 1}
                </span>
              )}
              <span className="flex-1">{line || '\u00A0'}</span>
            </div>
          ))}
        </div>
      )
    } else {
      // 滚动模式
      return (
        <div 
          className="prose max-w-none leading-relaxed"
          style={{ fontSize: `${fontSize}px` }}
        >
          {content}
        </div>
      )
    }
  }
  
  return (
    <div className={`bg-card rounded-lg ${className}`}>
      {/* 阅读工具栏 */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* 视图模式切换 */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'scroll' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('scroll')}
                className="px-3 py-1"
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'page' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('page')}
                className="px-3 py-1"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 字体大小控制 */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                className="px-2 py-1"
                disabled={fontSize <= 12}
              >
                A-
              </Button>
              <span className="px-2 py-1 text-sm font-medium">
                {fontSize}px
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                className="px-2 py-1"
                disabled={fontSize >= 24}
              >
                A+
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFontSize}
                className="px-2 py-1"
              >
                {i18n.t('book.readingTools.reset')}
              </Button>
            </div>
            
            {/* 显示控制 */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={showLineNumbers ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className="px-3 py-1"
              >
                {showLineNumbers ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="px-3 py-1"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* 阅读进度 */}
          <div className="text-sm text-muted-foreground">
            {i18n.t('book.readingTools.progress')}: {Math.round((currentSectionIndex + 1) / chapter.sections.length * 100)}%
          </div>
        </div>
      </div>
      
      {/* 内容标签页 */}
      <Tabs value={currentReadingMode} onValueChange={(value) => {
        console.log('🔄 Tab clicked! Changing from', currentReadingMode, 'to', value)
        setCurrentReadingMode(value as 'original' | 'translation' | 'interpretation')
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="original" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {i18n.t('book.content.original')}
          </TabsTrigger>
          <TabsTrigger value="translation" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {i18n.t('book.content.translation')}
          </TabsTrigger>
          <TabsTrigger value="interpretation" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {i18n.t('book.content.interpretation')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="original" className="mt-0">
          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2">
                {i18n.t('book.content.originalTitle')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {i18n.t('book.content.originalDescription')}
              </p>
            </div>
            <div 
              ref={contentRef}
              className="max-h-[600px] overflow-y-auto"
            >
              {renderContent()}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="translation" className="mt-0">
          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2">
                {i18n.t('book.content.translationTitle')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {i18n.t('book.content.translationDescription')}
              </p>
            </div>
            <div 
              ref={contentRef}
              className="max-h-[600px] overflow-y-auto"
            >
              {renderContent()}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="interpretation" className="mt-0">
          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2">
                {i18n.t('book.content.interpretationTitle')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {i18n.t('book.content.interpretationDescription')}
              </p>
            </div>
            <div 
              ref={contentRef}
              className="max-h-[600px] overflow-y-auto"
            >
              {renderContent()}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 章节导航 */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">
            {i18n.t('book.content.sectionNavigation')}
          </h4>
          <div className="text-sm text-muted-foreground">
            {i18n.t('book.content.currentSection')}: {currentSectionIndex + 1} / {chapter.sections.length}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {chapter.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSectionIndex(index)}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                currentSectionIndex === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <div className="truncate">
                {section.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {i18n.t('book.content.section')} {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
