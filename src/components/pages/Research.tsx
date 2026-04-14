import { useState } from 'react';
import { Search, TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const ResearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  const researchStats = [
    { label: '研究论文总数', value: '83+', icon: BookOpen, color: 'text-primary' },
    { label: '被引次数', value: '10,000+', icon: TrendingUp, color: 'text-secondary' },
    { label: '研究机构', value: '25+', icon: Award, color: 'text-primary' },
    { label: '研究人员', value: '100+', icon: Users, color: 'text-secondary' }
  ];

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
  ];

  const researchInstitutions = [
    { name: '广州中医药大学', papers: 28, citations: 856 },
    { name: '北京中医药大学', papers: 15, citations: 623 },
    { name: '南京中医药大学', papers: 12, citations: 445 },
    { name: '山东中医药大学', papers: 8, citations: 234 },
    { name: '成都中医药大学', papers: 6, citations: 189 }
  ];

  const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014'];

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
            className="px-4 py-2 rounded-lg border"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year === 'all' ? '全部年份' : year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 研究机构 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">合作机构</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {researchInstitutions.map((institution, index) => (
            <div key={index} className="paper-card p-4 text-center">
              <div className="text-lg font-semibold mb-2">{institution.name}</div>
              <div className="text-sm text-muted-foreground">
                论文：{institution.papers} | 引用：{institution.citations}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 研究论文列表 */}
      <div className="space-y-4">
        {researchPapers.map((paper) => (
          <div key={paper.id} className="paper-card p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{paper.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">
                  <span>作者：{paper.author}</span>
                  <span className="mx-2">|</span>
                  <span>机构：{paper.institution}</span>
                  <span className="mx-2">|</span>
                  <span>学位：{paper.degree}</span>
                  <span className="mx-2">|</span>
                  <span>年份：{paper.year}</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>引用：{paper.citations}</div>
                <div>下载：{paper.downloads}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {paper.abstract}
            </p>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((keyword, index) => (
                <span key={index} className="tcm-tag text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchPage;
