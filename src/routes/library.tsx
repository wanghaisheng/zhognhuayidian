import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, BookOpen, Filter, Calendar } from 'lucide-react'

export const Route = createFileRoute('/library')({
  component: LibraryPage,
})

function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [books, setBooks] = useState<any[]>([])

  useEffect(() => {
    // 直接导入数据文件，避免fetch JSON解析问题
    const loadBooks = async () => {
      try {
        // 动态导入数据文件
        const bookData = {
          id: 'huangdi-neijing',
          title: '黄帝内经',
          author: '佚名',
          dynasty: '先秦',
          category: 'medical-classics',
          year: '-2000',
          description: '中医经典著作，奠定中医理论基础',
          tags: ['医经', '基础理论']
        }
        
        setBooks([bookData])
      } catch (error) {
        console.error('Failed to load books:', error)
        // 设置默认数据
        setBooks([{
          id: 'huangdi-neijing',
          title: '黄帝内经',
          author: '佚名',
          dynasty: '先秦',
          category: 'medical-classics',
          year: '-2000',
          description: '中医经典著作，奠定中医理论基础',
          tags: ['医经', '基础理论']
        }])
      }
    }
    
    loadBooks()
  }, [])

  const categories = [
    { id: 'all', name: '全部', count: books.length },
    { id: 'medical-classics', name: '医经', count: 15 },
    { id: 'diagnostics', name: '诊法', count: 8 },
    { id: 'materia-medica', name: '本草', count: 23 },
    { id: 'prescriptions', name: '方书', count: 17 },
    { id: 'acupuncture', name: '针灸推拿', count: 14 },
    { id: 'shanghan', name: '伤寒金匮', count: 6 },
    { id: 'warm-diseases', name: '温病', count: 4 },
    { id: 'comprehensive', name: '综合医书', count: 8 },
    { id: 'clinical', name: '临证各科', count: 12 },
    { id: 'health', name: '养生食疗外治', count: 7 },
    { id: 'theories', name: '医论医案', count: 15 },
    { id: 'others', name: '其他', count: 3 }
  ]

  const filteredBooks = books.filter(book => 
    selectedCategory === 'all' || book.category === selectedCategory
  ).filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="ancient-title mb-4">中华医典古籍库</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          收录中国历代医学古籍1000部，卷帙上万，4亿字，汇集了新中国成立前的历代主要中医著作
        </p>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="搜索古籍书名、作者、关键词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tcm-search pl-12 pr-20"
          />
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="paper-card p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{books.length}</div>
          <div className="text-muted-foreground">古籍总数</div>
        </div>
        <div className="paper-card p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">12</div>
          <div className="text-muted-foreground">分类目录</div>
        </div>
        <div className="paper-card p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">4亿+</div>
          <div className="text-muted-foreground">总字数</div>
        </div>
        <div className="paper-card p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">83</div>
          <div className="text-muted-foreground">相关研究</div>
        </div>
      </div>

      {/* 古籍列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="ancient-book-item">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-foreground flex-1 mr-2">{book.title}</h3>
              <span className="dynasty-tag whitespace-nowrap">{book.dynasty}</span>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3 space-y-1">
              <div>作者：{book.author}</div>
              <div>成书年代：{book.year}</div>
              <div>分类：<span className="tcm-tag">{book.category}</span></div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {book.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {book.tags.map((tag, index) => (
                <span key={index} className="tcm-tag text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            <Link 
              to={`/book/${book.id}`}
              className="scroll-btn w-full"
            >
              <BookOpen className="w-4 h-4 mr-2 inline" />
              阅读古籍
            </Link>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      <div className="text-center mt-12">
        <button className="scroll-btn">
          加载更多古籍
        </button>
      </div>
    </div>
  )
}
