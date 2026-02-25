import React from 'react'
import { useTranslation } from 'react-i18next'
import { Progress } from '@/components/ui/progress'
import { Clock, BookOpen, CheckCircle } from 'lucide-react'

interface ReadingProgressProps {
  progress: number
  total: number
  className?: string
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  progress,
  total,
  className = ''
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  
  const progressPercentage = Math.round((progress / total) * 100)
  const completedChapters = Math.floor(progress)
  const remainingChapters = total - completedChapters
  
  return (
    <div className={`bg-card rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {i18n.t('book.readingProgress.title')}
        </h3>
        <div className="text-sm text-muted-foreground">
          {i18n.t('book.readingProgress.completed')}: {completedChapters}/{total}
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="mb-4">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <span>{i18n.t('book.readingProgress.progress')}: {progressPercentage}%</span>
          <span>{i18n.t('book.readingProgress.remaining')}: {remainingChapters} {i18n.t('book.readingProgress.chapters')}</span>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{completedChapters}</div>
          <div className="text-xs text-muted-foreground">
            {i18n.t('book.readingProgress.completedChapters')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{remainingChapters}</div>
          <div className="text-xs text-muted-foreground">
            {i18n.t('book.readingProgress.remainingChapters')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{progressPercentage}%</div>
          <div className="text-xs text-muted-foreground">
            {i18n.t('book.readingProgress.percentage')}
          </div>
        </div>
      </div>
      
      {/* 预计完成时间 */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            {i18n.t('book.readingProgress.estimatedTime')}: {Math.round(remainingChapters * 15)} {i18n.t('book.readingProgress.minutes')}
          </span>
        </div>
      </div>
      
      {/* 状态指示器 */}
      {progressPercentage >= 100 && (
        <div className="mt-4 flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {i18n.t('book.readingProgress.completed')}
          </span>
        </div>
      )}
      
      {progressPercentage >= 50 && progressPercentage < 100 && (
        <div className="mt-4 flex items-center text-blue-600">
          <BookOpen className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {i18n.t('book.readingProgress.inProgress')}
          </span>
        </div>
      )}
      
      {progressPercentage < 50 && progressPercentage > 0 && (
        <div className="mt-4 flex items-center text-orange-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {i18n.t('book.readingProgress.started')}
          </span>
        </div>
      )}
    </div>
  )
}
