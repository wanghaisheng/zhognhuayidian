import { useState } from 'react';
import { Search, Brain, BookOpen, Filter, Sparkles } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const searchTypes = [
    { id: 'all', name: '综合搜索', icon: Search },
    { id: 'books', name: '古籍检索', icon: BookOpen },
    { id: 'symptoms', name: '症状查询', icon: Brain },
    { id: 'prescriptions', name: '方剂配伍', icon: Sparkles }
  ];

  const recentSearches = [
    '感冒治疗方剂',
    '李时珍本草纲目',
    '中医诊断方法',
    '针灸穴位定位',
    '伤寒论辨证'
  ];

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
  ];

  const smartSuggestions = [
    '基于"感冒"为您推荐相关方剂',
    '查看"感冒"的历代医家论述',
    '探索"感冒"的现代研究进展',
    '学习"感冒"的针灸治疗方法'
  ];

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
            placeholder="输入关键词、症状、方剂名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tcm-search pl-20 pr-32 text-lg py-4"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors">
            搜索
          </button>
        </div>
      </div>

      {/* 高级搜索 */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Filter className="w-4 h-4" />
          高级筛选
        </button>
        
        {showAdvanced && (
          <div className="mt-4 p-6 bg-card rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">朝代</label>
                <select className="w-full px-4 py-2 rounded-lg border">
                  <option>全部朝代</option>
                  <option>先秦</option>
                  <option>汉</option>
                  <option>唐</option>
                  <option>宋</option>
                  <option>元</option>
                  <option>明</option>
                  <option>清</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">分类</label>
                <select className="w-full px-4 py-2 rounded-lg border">
                  <option>全部分类</option>
                  <option>医经</option>
                  <option>本草</option>
                  <option>方书</option>
                  <option>针灸</option>
                  <option>伤寒</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">相关性</label>
                <select className="w-full px-4 py-2 rounded-lg border">
                  <option>全部</option>
                  <option>高相关性</option>
                  <option>中相关性</option>
                  <option>低相关性</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 最近搜索 */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-lg font-semibold mb-4">最近搜索</h2>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(search)}
              className="px-4 py-2 bg-secondary/10 rounded-full text-sm hover:bg-secondary/20 transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* 搜索结果 */}
      {searchQuery && (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">搜索结果</h2>
            <span className="text-muted-foreground">找到 {searchResults.length} 个结果</span>
          </div>
          
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="paper-card p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {result.type === 'book' && <BookOpen className="w-6 h-6 text-primary" />}
                    {result.type === 'prescription' && <Sparkles className="w-6 h-6 text-secondary" />}
                    {result.type === 'symptom' && <Brain className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.author && `作者：${result.author}`}
                      {result.source && `来源：${result.source}`}
                      {result.dynasty && `朝代：${result.dynasty}`}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {result.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">相关性：{result.relevance}%</span>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tcm-tag text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 智能建议 */}
      {searchQuery && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI 智能建议
          </h2>
          <div className="space-y-2">
            {smartSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
