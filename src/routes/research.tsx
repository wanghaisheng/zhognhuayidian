import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, TrendingUp, Users, BookOpen, Award } from 'lucide-react'

export const Route = createFileRoute('/research')({
  component: ResearchPage,
})

function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')

  const researchStats = [
    { label: '研究论文总数', value: '83+', icon: BookOpen, color: 'text-primary' },
    { label: '被引次数', value: '10,000+', icon: TrendingUp, color: 'text-secondary' },
    { label: '研究机构', value: '25+', icon: Award, color: 'text-primary' },
    { label: '研究人员', value: '100+', icon: Users, color: 'text-secondary' }
  ]

  const researchPapers = [
    {
      id: 1,
      title: '脂肪肝的中医古籍文献研究',
      author: '李泽鹏',
      institution: '广州中医药大学',
      degree: '硕士',
      year: '2014',
      citations: 56,
      downloads: 2947,
      keywords: ['脂肪肝', '古籍', '文献研究'],
      abstract: '本文通过系统梳理中医古籍中关于脂肪肝的相关文献，探讨中医对脂肪肝的认识历程和治疗方法...'
    },
    {
      id: 2,
      title: '克罗恩病的中医古籍文献整理',
      author: '李志雄',
      institution: '广州中医药大学',
      degree: '硕士',
      year: '2016',
      citations: 42,
      downloads: 1097,
      keywords: ['克罗恩病', '古籍整理', '中医治疗'],
      abstract: '克罗恩病作为现代医学疾病，在中医古籍中虽无直接对应病名，但相关症状描述散见于历代医著...'
    },
    {
      id: 3,
      title: '痤疮古代文献整理及研究',
      author: '毛文姣',
      institution: '南京中医药大学',
      degree: '硕士',
      year: '2009',
      citations: 41,
      downloads: 2507,
      keywords: ['痤疮', '古代文献', '皮肤病'],
      abstract: '痤疮是临床常见的皮肤疾病，中医对其认识历史悠久。本文系统整理了从先秦至清代关于痤疮的文献...'
    }
  ]

  const researchInstitutions = [
    { name: '广州中医药大学', papers: 28, citations: 856 },
    { name: '北京中医药大学', papers: 15, citations: 623 },
    { name: '南京中医药大学', papers: 12, citations: 445 },
    { name: '山东中医药大学', papers: 8, citations: 234 },
    { name: '成都中医药大学', papers: 6, citations: 189 }
  ]

  const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014']

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="ancient-title mb-4">学术研究平台</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          基于中华医典的深度学术研究，涵盖中医古籍文献整理、数据挖掘、临床应用等多个领域
        </p>
      </div>

      {/* 研究统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {researchStats.map((stat, index) => (
          <div key={index} className="paper-card p-6 text-center">
            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
            <div className="text-muted-foreground text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="搜索研究论文、作者、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tcm-search pl-12"
            />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="tcm-search px-6 py-4"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year === 'all' ? '全部年份' : year + '年'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 研究论文列表 */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">最新研究论文</h2>
          <div className="space-y-6">
            {researchPapers.map((paper) => (
              <div key={paper.id} className="paper-card p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-foreground flex-1 mr-4">
                    {paper.title}
                  </h3>
                  <span className="tcm-tag whitespace-nowrap">{paper.year}</span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-3">
                  <p>作者：{paper.author}</p>
                  <p>机构：{paper.institution}</p>
                  <p>学位：{paper.degree}</p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {paper.abstract}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {paper.keywords.map((keyword, index) => (
                    <span key={index} className="tcm-tag text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex gap-4">
                    <span>被引 {paper.citations} 次</span>
                    <span>下载 {paper.downloads} 次</span>
                  </div>
                  <button className="scroll-btn px-4 py-2 text-sm">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 研究机构排行 */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">研究机构排行</h2>
          <div className="paper-card p-6">
            <div className="space-y-4">
              {researchInstitutions.map((institution, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{institution.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {institution.papers} 篇论文 · {institution.citations} 次引用
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 研究趋势 */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">研究趋势</h3>
            <div className="paper-card p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">数据挖掘与AI应用</span>
                  <span className="tcm-tag text-xs">热门</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">古籍数字化保护</span>
                  <span className="tcm-tag text-xs">上升</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">临床应用研究</span>
                  <span className="tcm-tag text-xs">稳定</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
