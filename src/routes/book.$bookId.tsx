import { createFileRoute } from '@tanstack/react-router'
import { SEOHead } from '@/components/molecules/SEOHead'
import { BookDetailPage } from '@/components/book/organisms/BookDetailPage'
import { useBook, fetchBook } from '@/hooks/useBookData'
import { generateCanonicalUrl } from '@/utils/seo'
import { useTranslation } from 'react-i18next'
import type { AncientBook } from '@/types/book'

export const Route = createFileRoute('/book/$bookId')({
  component: BookDetailRoute,
  loader: async ({ params, context }) => {
    const bookId = params.bookId as string
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    
    // 尝试从URL或请求中获取语言，默认使用中文
    const locale = 'zh'; // 默认使用中文快照
    
    try {
      // 使用修复后的 fetchBook 函数
      const book = await fetchBook(bookId, locale)
      
      // 预加载到 React Query 缓存
      await queryClient?.ensureQueryData({
        queryKey: ['book', bookId, locale],
        queryFn: () => fetchBook(bookId, locale),
        staleTime: 5 * 60_000, // 5分钟
      });
      
      return { book }
    } catch (error) {
      console.error('Failed to load book data:', error)
      return { book: null }
    }
  },
  meta: ({ params }) => {
    const bookId = params.bookId as string
    return {
      title: bookId,
      description: `古籍详情 - ${bookId}`
    }
  }
})

function BookDetailRoute() {
  const { bookId } = Route.useParams()
  const { i18n } = useTranslation()
  const locale = i18n.language as 'zh' | 'en'
  
  // 从loader获取数据
  const { book } = Route.useLoaderData()
  
  // 如果loader没有数据，使用hook获取
  const { data: bookData, isLoading, error } = useBook(bookId)
  const currentBook = book || bookData
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载古籍内容...</p>
        </div>
      </div>
    )
  }
  
  if (error || !currentBook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">古籍未找到</h1>
          <p className="text-muted-foreground mb-4">
            抱歉，找不到您要查看的古籍内容。
          </p>
          <a 
            href="/library" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            返回古籍库
          </a>
        </div>
      </div>
    )
  }
  
  // 生成SEO数据
  const title = currentBook.title[locale] || currentBook.title.zh
  const description = `${currentBook.dynasty}中医古籍《${title}》，${currentBook.author}著，包含${currentBook.metadata.chapters}章，约${currentBook.metadata.wordCount}字。`
  const canonical = generateCanonicalUrl(`/book/${bookId}`, locale)
  
  // 生成结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: title,
    author: {
      '@type': 'Person',
      name: currentBook.author
    },
    datePublished: currentBook.metadata.publishYear || '-2000',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    about: '中医学',
    description: description,
    numberOfPages: currentBook.metadata.chapters,
    keywords: currentBook.metadata.tags.join(', '),
    publisher: {
      '@type': 'Organization',
      name: '中华医典'
    }
  }
  
  return (
    <>
      <SEOHead
        title={`${title} - 中华医典`}
        description={description}
        keywords={currentBook.metadata.tags.join(', ')}
        canonical={canonical}
        ogImage={currentBook.metadata.coverImage || '/images/books/default-cover.jpg'}
        structuredData={structuredData}
      />
      <BookDetailPage book={currentBook} />
    </>
  )
}
