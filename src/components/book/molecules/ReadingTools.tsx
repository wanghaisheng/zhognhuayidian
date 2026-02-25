import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Search, 
  Bookmark, 
  Settings, 
  Volume2, 
  Type, 
  Moon, 
  Sun, 
  Eye, 
  EyeOff,
  Download,
  Share2,
  Printer,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useNotes, useBookmarks } from '@/hooks/useBookData'
import type { Chapter, ReadingSettings } from '@/types/book'

interface ReadingToolsProps {
  readingMode: 'original' | 'translation' | 'interpretation'
  chapter: Chapter
  book: any
  onModeChange: (mode: 'original' | 'translation' | 'interpretation') => void
  className?: string
}

export const ReadingTools: React.FC<ReadingToolsProps> = ({
  readingMode,
  chapter,
  book,
  onModeChange,
  className = ''
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  
  const { notes, addNote } = useNotes(book.id)
  const { bookmarks, addBookmark } = useBookmarks(book.id)
  
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  
  // 搜索功能
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      // 在当前章节中搜索
      const results: string[] = []
      chapter.sections.forEach(section => {
        const content = `${section.originalText} ${section.translation} ${section.interpretation}`.toLowerCase()
        if (content.includes(query.toLowerCase())) {
          results.push(section.title)
        }
      })
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }
  
  // 添加笔记
  const handleAddNote = () => {
    addNote({
      chapterId: chapter.id,
      sectionId: chapter.sections[0]?.id || '',
      content: '',
      range: { start: 0, end: 100, text: '' }
    })
  }
  
  // 添加书签
  const handleAddBookmark = () => {
    addBookmark({
      chapterId: chapter.id,
      sectionId: chapter.sections[0]?.id || '',
      position: 0,
      note: `${chapter.title[locale] || chapter.title.zh} - 书签`
    })
  }
  
  // 导出功能
  const handleExport = (format: 'pdf' | 'txt' | 'docx') => {
    const content = chapter.sections.map(section => ({
      title: section.title,
      originalText: section.originalText,
      translation: section.translation,
      interpretation: section.interpretation
    }))
    
    // 这里应该调用导出API
    console.log('Exporting to', format, content)
    // 实际实现中需要调用后端API
  }
  
  // 分享功能
  const handleShare = () => {
    const url = window.location.href
    const title = `${chapter.title[locale] || chapter.title.zh} - ${book.title[locale] || book.title.zh}`
    
    if (navigator.share) {
      navigator.share({
        title,
        text: `分享《${book.title[locale] || book.title.zh}》中的${chapter.title[locale] || chapter.title.zh}`,
        url
      })
    } else {
      navigator.clipboard.writeText(url)
    }
  }
  
  // 打印功能
  const handlePrint = () => {
    window.print()
  }
  
  // 全屏功能
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  
  return (
    <div className={`bg-card rounded-lg p-4 ${className}`}>
      {/* 主要工具栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* 搜索 */}
          <Button
            variant={showSearch ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="px-3 py-2"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {/* 书签 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddBookmark}
            className="px-3 py-2"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          {/* 笔记 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNote}
            className="px-3 py-2"
          >
            <Type className="h-4 w-4" />
          </Button>
          
          {/* 设置 */}
          <Button
            variant={showSettings ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 分享 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="px-3 py-2"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          {/* 打印 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="px-3 py-2"
          >
            <Printer className="h-4 w-4" />
          </Button>
          
          {/* 全屏 */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="px-3 py-2"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* 搜索栏 */}
      {showSearch && (
        <div className="mb-4">
          <Input
            placeholder={i18n.t('book.readingTools.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
          {searchResults.length > 0 && (
            <div className="mt-2 p-2 bg-muted rounded">
              <div className="text-sm font-medium mb-1">
                {i18n.t('book.readingTools.searchResults')}
              </div>
              {searchResults.map((result, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 设置面板 */}
      {showSettings && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 字体大小 */}
            <div>
              <Label className="text-sm font-medium">
                {i18n.t('book.readingTools.fontSize')}
              </Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <span>16px</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="14">14px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="18">18px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* 主题 */}
            <div>
              <Label className="text-sm font-medium">
                {i18n.t('book.readingTools.theme')}
              </Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <span>{i18n.t('book.readingTools.light')}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    {i18n.t('book.readingTools.light')}
                  </SelectItem>
                  <SelectItem value="dark">
                    {i18n.t('book.readingTools.dark')}
                  </SelectItem>
                  <SelectItem value="sepia">
                    {i18n.t('book.readingTools.sepia')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 显示选项 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {i18n.t('book.readingTools.lineNumbers')}
              </Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {i18n.t('book.readingTools.wordWrap')}
              </Label>
              <Switch defaultChecked />
            </div>
          </div>
          
          {/* 导出选项 */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {i18n.t('book.readingTools.export')}
            </Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
              >
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('txt')}
              >
                TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('docx')}
              >
                DOCX
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* 快捷键提示 */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Ctrl+F - {i18n.t('book.readingTools.search')}</div>
          <div>Ctrl+N - {i18n.t('book.readingTools.addNote')}</div>
          <div>Ctrl+B - {i18n.t('book.readingTools.bookmark')}</div>
          <div>Ctrl+E - {i18n.t('book.readingTools.export')}</div>
          <div>F11 - {i18n.t('book.readingTools.fullscreen')}</div>
        </div>
      </div>
    </div>
  )
}
