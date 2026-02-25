import React, { useState } from 'react'
import { Search, Filter, Brain } from 'lucide-react'

interface TCMSearchBoxProps {
  placeholder?: string
  onSearch?: (query: string) => void
  showAdvanced?: boolean
  className?: string
}

export const TCMSearchBox: React.FC<TCMSearchBoxProps> = ({
  placeholder = '搜索古籍、方剂、症状、药材...',
  onSearch,
  showAdvanced = false,
  className = ''
}) => {
  const [query, setQuery] = useState('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const handleSearch = () => {
    onSearch?.(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="tcm-search pl-12 pr-20"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 scroll-btn px-4 py-2 text-sm"
        >
          搜索
        </button>
      </div>

      {showAdvanced && (
        <div className="text-center mt-3">
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-2 mx-auto"
          >
            <Filter className="w-4 h-4" />
            {showAdvancedOptions ? '收起高级搜索' : '展开高级搜索'}
          </button>
        </div>
      )}

      {showAdvancedOptions && (
        <div className="mt-4 paper-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">朝代范围</label>
              <select className="tcm-search text-sm">
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
              <select className="tcm-search text-sm">
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
              <select className="tcm-search text-sm">
                <option>全文搜索</option>
                <option>标题搜索</option>
                <option>作者搜索</option>
                <option>关键词搜索</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
