import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Brain, BookOpen, Filter, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const searchTypes = [
    { id: 'all', name: '综合搜索', icon: Search },
    { id: 'books', name: '古籍检索', icon: BookOpen },
    { id: 'symptoms', name: '症状查询', icon: Brain },
    { id: 'prescriptions', name: '方剂配伍', icon: Sparkles }
  ]

  const recentSearches = [
    '感冒治疗方剂',
    '李时珍本草纲目',
    '中医诊断方法',
    '针灸穴位定位',
    '伤寒论辨证'
  ]

  const searchResults = [
    {
      type: 'book',
      title: '本草纲目',
      author: '李时珍',
      dynasty: '明',
      category: '本草',
      relevance: 95,
      excerpt: '《本草纲目》是明代李时珍所著的中医药学巨著，收录药物1892种...',
      tags: ['药物学', '本草', '明代']
    },
    {
      type: 'prescription',
      title: '桂枝汤',
      source: '伤寒论',
      author: '张仲景',
      dynasty: '东汉',
      relevance: 88,
      excerpt: '桂枝汤是治疗太阳中风证的代表方剂，由桂枝、芍药、甘草、生姜、大枣组成...',
      tags: ['方剂', '伤寒', '解表']
    },
    {
      type: 'symptom',
      title: '感冒',
      category: '外感病',
      relevance: 82,
      excerpt: '感冒在中医中属于外感病范畴，分为风寒感冒、风热感冒、暑湿感冒等类型...',
      tags: ['症状', '外感', '常见病']
    }
  ]

  const smartSuggestions = [
    '基于"感冒"为您推荐相关方剂',
    '查看"感冒"的历代医家论述',
    '探索"感冒"的现代研究进展',
    '学习"感冒"的针灸治疗方法'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="ancient-title mb-4">智能检索系统</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          AI驱动的中医古籍智能检索，支持语义理解、症状匹配、方剂推荐
        </p>
      </div>

      {/* 搜索类型选择 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {searchTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSearchType(type.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              searchType === type.id
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
            }`}
          >
            <type.icon className="w-4 h-4" />
            {type.name}
          </button>
        ))}
      </div>

      {/* 主搜索框 */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
          <input
            type="text"
            placeholder={
              searchType === 'all' ? '搜索古籍、方剂、症状、药材...' :
              searchType === 'books' ? '搜索古籍书名、作者、朝代...' :
              searchType === 'symptoms' ? '输入症状，查找相关治疗方法...' :
              '搜索方剂名称、功效、组成...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tcm-search pl-16 pr-20 text-lg"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 scroll-btn px-6 py-2">
            智能搜索
          </button>
        </div>

        {/* 高级搜索切换 */}
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-2 mx-auto"
          >
            <Filter className="w-4 h-4" />
            {showAdvanced ? '收起高级搜索' : '展开高级搜索'}
          </button>
        </div>
      </div>

      {/* 高级搜索选项 */}
      {showAdvanced && (
        <div className="max-w-4xl mx-auto mb-8 paper-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">朝代范围</label>
              <select className="tcm-search">
                <option>全部朝代</option>
                <option>先秦两汉</option>
                <option>魏晋南北朝</option>
                <option>隋唐</option>
                <option>宋金元</option>
                <option>明清</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">医学分类</label>
              <select className="tcm-search">
                <option>全部分类</option>
                <option>医经</option>
                <option>本草</option>
                <option>方书</option>
                <option>针灸</option>
                <option>诊法</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">搜索范围</label>
              <select className="tcm-search">
                <option>全文搜索</option>
                <option>标题搜索</option>
                <option>作者搜索</option>
                <option>关键词搜索</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 最近搜索 */}
      {searchQuery === '' && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">最近搜索</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(search)}
                className="px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full text-sm transition-colors duration-200"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索结果 */}
      {searchQuery && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              搜索结果 ({searchResults.length} 条)
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg text-sm">
                相关度排序
              </button>
              <button className="px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg text-sm">
                时间排序
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {searchResults.map((result, index) => (
              <div key={index} className="paper-card p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-semibold text-foreground">{result.title}</h4>
                      <span className={`tcm-tag text-xs ${
                        result.type === 'book' ? 'bg-primary/20' :
                        result.type === 'prescription' ? 'bg-secondary/20' :
                        'bg-accent/20'
                      }`}>
                        {result.type === 'book' ? '古籍' :
                         result.type === 'prescription' ? '方剂' : '症状'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        相关度: {result.relevance}%
                      </span>
                    </div>
                    
                    {(result.author || result.source) && (
                      <div className="text-sm text-muted-foreground mb-2">
                        {result.author && <span>作者：{result.author}</span>}
                        {result.author && result.dynasty && <span> · </span>}
                        {result.dynasty && <span>朝代：{result.dynasty}</span>}
                        {result.source && <span>来源：{result.source}</span>}
                        {result.category && <span> · 分类：{result.category}</span>}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {result.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags?.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tcm-tag text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="scroll-btn px-6 py-2">
                  查看详情
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI智能推荐 */}
      {searchQuery && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="paper-card p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">AI 智能推荐</h3>
            </div>
            <div className="space-y-2">
              {smartSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 bg-card/50 hover:bg-card rounded-lg transition-colors duration-200 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
