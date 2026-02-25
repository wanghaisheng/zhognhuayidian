import { createFileRoute } from '@tanstack/react-router'
import { SEOHead } from '@/components/molecules/SEOHead'
import { ChapterDetailPage } from '@/components/book/organisms/ChapterDetailPage'
import { useBook, useChapter } from '@/hooks/useBookData'
import { generateCanonicalUrl } from '@/utils/seo'
import { useTranslation } from 'react-i18next'
import type { AncientBook, Chapter } from '@/types/book'

export const Route = createFileRoute('/book/$bookId/chapter/$chapterId')({
  component: ChapterDetailRoute,
  loader: async ({ params }) => {
    const { bookId, chapterId } = params as { bookId: string; chapterId: string }
    
    try {
      // 预加载书籍和章节数据
      const [book, chapter] = await Promise.all([
        fetchBookData(bookId),
        fetchChapterData(bookId, chapterId)
      ])
      
      return { book, chapter }
    } catch (error) {
      console.error('Failed to load chapter data:', error)
      return { book: null, chapter: null }
    }
  },
  meta: ({ params }) => {
    const { bookId, chapterId } = params as { bookId: string; chapterId: string }
    return {
      title: `${bookId} - ${chapterId}`,
      description: `古籍章节详情 - ${bookId} - ${chapterId}`
    }
  }
})

// 数据加载函数
async function fetchBookData(bookId: string): Promise<AncientBook> {
  console.warn('Database failed, falling back to snapshots for book')
  
  // 使用项目标准的静态文件加载模式 - import.meta.glob
  const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false })
  const targetLocale = 'zh' // 默认使用中文
  
  // 处理bookId映射：suwen -> huangdi-neijing
  const actualBookId = bookId === 'suwen' ? 'huangdi-neijing' : bookId
  
  const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/${actualBookId}.json`
  const fallbackPath = `/src/data/snapshots/en/content/ancient-books/${actualBookId}.json`
  
  console.log('Book snapshot paths available:', Object.keys(snapshotMap))
  console.log('Attempting to load book snapshot from:', snapshotPath)
  console.log('Fallback path:', fallbackPath)
  
  const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath]
  
  if (loader) {
    console.log('Found book loader, loading data...')
    const mod = await loader()
    const data = (mod as any).default || mod
    console.log('Loaded book data:', data)
    
    // 检查数据结构，适配不同的快照格式
    if (data && typeof data === 'object') {
      // 如果是标准的 content 格式
      if ('content' in data) {
        console.log('Using content format for book')
        return data.content as AncientBook
      }
      // 如果直接是书籍数据
      if ('id' in data && 'title' in data) {
        console.log('Using direct book format')
        return data as AncientBook
      }
    }
    console.log('Book data format not recognized, using fallback')
  } else {
    console.log('No book loader found, using fallback data')
  }
  
  // 3. 最后回退到硬编码数据
  const fallbackData: AncientBook = {
    id: actualBookId,
    title: {
      zh: '黄帝内经',
      en: 'Yellow Emperor\'s Inner Canon'
    },
    dynasty: '先秦',
    author: '佚名',
    category: 'medical-classics',
    metadata: {
      dynasty: '先秦',
      author: '佚名',
      chapters: 18,
      wordCount: 25000,
      publishYear: '-2000',
      tags: ['医经', '基础理论', '黄帝', '阴阳', '五行'],
      coverImage: '/images/books/huangdi-neijing-cover.jpg'
    },
    translations: {
      zh: {
        title: '黄帝内经',
        description: '中医理论奠基之作'
      },
      en: {
        title: 'Yellow Emperor\'s Inner Canon',
        description: 'The foundational classic of Chinese medicine'
      }
    },
    chapters: [],
    relatedBooks: [],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  }
  
  return fallbackData
}

async function fetchChapterData(bookId: string, chapterId: string): Promise<Chapter> {
  try {
    const response = await fetch(`/api/books/${bookId}/chapters/${chapterId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.warn('Database failed, falling back to snapshots')
    
    // 使用项目标准的静态文件加载模式 - import.meta.glob
    const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*/chapters/*.json', { eager: false })
    const targetLocale = 'zh' // 默认使用中文
    
    // 处理bookId映射：suwen -> huangdi-neijing
    const actualBookId = bookId === 'suwen' ? 'huangdi-neijing' : bookId
    
    const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/${actualBookId}/chapters/${chapterId}.json`
    const fallbackPath = `/src/data/snapshots/en/content/ancient-books/${actualBookId}/chapters/${chapterId}.json`
    
    console.log('Available chapter snapshot paths:', Object.keys(snapshotMap))
    console.log('Book ID mapping:', bookId, '->', actualBookId)
    console.log('Attempting to load chapter snapshot from:', snapshotPath)
    console.log('Fallback path:', fallbackPath)
    
    const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath]
    
    if (loader) {
      console.log('Found chapter loader, loading data...')
      const mod = await loader()
      const data = (mod as any).default || mod
      console.log('Loaded chapter data:', data)
      return data
    } else {
      console.log('No chapter loader found, using fallback data')
      // 返回一个基本的章节结构
      return {
        id: chapterId,
        title: {
          zh: '章节标题',
          en: 'Chapter Title'
        },
        order: 0,
        summary: '章节摘要',
        keyConcepts: [],
        sections: [
          {
            id: `${chapterId}-1`,
            title: '第一节',
            order: 0,
            originalText: '古籍原文内容',
            translation: '白话译文内容',
            interpretation: '现代解读内容',
            keyConcepts: []
          }
        ]
      }
    }
  }
}

function ChapterDetailRoute() {
  const { bookId, chapterId } = Route.useParams() as { bookId: string; chapterId: string }
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  
  // 从loader获取数据
  const { book: loaderBook, chapter: loaderChapter } = Route.useLoaderData()
  
  // 如果loader没有数据，使用hook获取
  const { data: bookData, isLoading: bookLoading, error: bookError } = useBook(bookId)
  const { data: chapterData, isLoading: chapterLoading, error: chapterError } = useChapter(bookId, chapterId)
  
  const currentBook = loaderBook || bookData
  const currentChapter = loaderChapter || chapterData
  
  if (bookLoading || chapterLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载章节内容...</p>
        </div>
      </div>
    )
  }
  
  if (bookError || chapterError || !currentBook || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">章节未找到</h1>
          <p className="text-muted-foreground mb-4">
            抱歉，找不到您要查看的章节内容。
          </p>
          <a 
            href={`/book/${bookId}`}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mr-2"
          >
            返回古籍详情
          </a>
          <a 
            href="/library"
            className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            返回古籍库
          </a>
        </div>
      </div>
    )
  }
  
  // 生成SEO数据
  const bookTitle = currentBook.title[locale] || currentBook.title.zh
  const chapterTitle = currentChapter.title[locale] || currentChapter.title.zh
  const title = `${chapterTitle} - ${bookTitle}`
  const description = `${bookTitle} - ${chapterTitle}。${currentChapter.summary || '详细内容解读。'}`
  const canonical = generateCanonicalUrl(`/book/${bookId}/chapter/${chapterId}`, locale)
  
  // 生成结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: chapterTitle,
    description: description,
    isPartOf: {
      '@type': 'Book',
      name: bookTitle,
      author: {
        '@type': 'Person',
        name: currentBook.author
      },
      datePublished: currentBook.metadata.publishYear || '-2000',
      inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US'
    },
    position: currentChapter.order + 1,
    about: '中医学'
  }
  
  return (
    <>
      <SEOHead
        title={`${title} - 中华医典`}
        description={description}
        keywords={[bookTitle, chapterTitle, ...currentBook.metadata.tags].join(', ')}
        canonical={canonical}
        ogImage={currentBook.metadata.coverImage || '/images/books/default-cover.jpg'}
        structuredData={structuredData}
      />
      <ChapterDetailPage 
        book={currentBook} 
        chapter={currentChapter}
      />
    </>
  )
}
