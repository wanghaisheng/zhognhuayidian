import SEOHead from '@/components/molecules/SEOHead';
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search,
  Users,
  Award,
  Brain,
  Globe,
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Calendar,
  BookMarked,
  Eye
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { generateWebsiteSchema, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import { getSiteName, SITE_CONFIG } from "@/config/site";
import ogHomeImage from "@/assets/og-home.jpg";
import { TCMBlogCard } from '@/components/tcm/TCMBlogCard';

const UnifiedTCMIndex = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'zh';
  const siteName = getSiteName(currentLang);

  const homeSeo = {
    title: t('home.seo.title', '中华医典 - 传承中医智慧，弘扬中华文化'),
    description: t('home.seo.description', '收录中国历代医学古籍1000部，卷帙上万，4亿字，汇集了新中国成立前的历代主要中医著作'),
  };
  
  const structuredData = [
    generateWebsiteSchema(),
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { label: t('common.home', '首页'), href: '/' }
    ])
  ];

  const featuredStats = [
    { 
      label: t('home.stats.books', '古籍总数'), 
      value: '1000+', 
      icon: BookOpen, 
      color: "text-tcm-bronze",
      bgColor: "bg-tcm-bronze/10",
      desc: t('home.stats.booksDesc', '涵盖历代主要中医著作')
    },
    { 
      label: t('home.stats.volumes', '卷帙数量'), 
      value: '10000+', 
      icon: BookMarked, 
      color: "text-tcm-celadon",
      bgColor: "bg-tcm-celadon/10", 
      desc: t('home.stats.volumesDesc', '包含各类医学典籍')
    },
    { 
      label: t('home.stats.characters', '文字总量'), 
      value: '4亿+', 
      icon: Eye, 
      color: "text-tcm-gold",
      bgColor: "bg-tcm-gold/10", 
      desc: t('home.stats.charactersDesc', '丰富的医学文献')
    },
    { 
      label: t('home.stats.dynasties', '覆盖朝代'), 
      value: '3000年', 
      icon: Calendar, 
      color: "text-tcm-ink",
      bgColor: "bg-tcm-ink/10", 
      desc: t('home.stats.dynastiesDesc', '从先秦到清末')
    }
  ];

  const features = [
    {
      title: t('home.features.library', '古籍浏览'),
      description: t('home.features.libraryDesc', '按照朝代、医家、分类浏览历代中医古籍，支持全文检索和在线阅读'),
      icon: BookOpen,
      href: '/library',
      color: 'text-tcm-bronze'
    },
    {
      title: t('home.features.search', '智能检索'),
      description: t('home.features.searchDesc', 'AI驱动的智能搜索引擎，支持语义检索、知识图谱关联和智能推荐'),
      icon: Search,
      href: '/search',
      color: 'text-tcm-celadon'
    },
    {
      title: t('home.features.research', '学术研究'),
      description: t('home.features.researchDesc', '提供专业的学术研究工具，支持文献分析、数据挖掘和学术交流'),
      icon: Award,
      href: '/research',
      color: 'text-tcm-gold'
    },
    {
      title: t('home.features.knowledge', '知识图谱'),
      description: t('home.features.knowledgeDesc', '构建中医知识图谱，展示医家、著作、理论之间的关联关系'),
      icon: Brain,
      href: '/knowledge',
      color: 'text-tcm-ink'
    }
  ];

  const recentArticles = [
    {
      title: t('home.articles.huangdi.title', '《黄帝内经》的现代解读'),
      excerpt: t('home.articles.huangdi.excerpt', '深入探讨黄帝内经的核心思想，分析其在现代中医临床中的应用价值'),
      slug: 'huangdi-neijing-modern-interpretation',
      category: t('home.articles.huangdi.category', '学术分析'),
      publishedAt: '2024-01-15',
      readTime: 8,
      featuredImage: '/images/huangdi-neijing.jpg',
      views: 1250,
      likes: 89
    },
    {
      title: t('home.articles.shanghan.title', '张仲景《伤寒论》学术贡献'),
      excerpt: t('home.articles.shanghan.excerpt', '系统梳理张仲景在《伤寒论》中的学术思想，探讨其对后世中医发展的深远影响'),
      slug: 'zhang-zhongjing-shanghan-lun',
      category: t('home.articles.shanghan.category', '医史文献'),
      publishedAt: '2024-01-10',
      readTime: 12,
      featuredImage: '/images/shanghan-lun.jpg',
      views: 980,
      likes: 67
    },
    {
      title: t('home.articles.diagnosis.title', '中医诊断技术的数字化应用'),
      excerpt: t('home.articles.diagnosis.excerpt', '介绍现代数字技术在中医诊断中的应用，包括舌诊图像分析、脉象检测设备'),
      slug: 'tcm-diagnosis-digital-technology',
      category: t('home.articles.diagnosis.category', '技术方法'),
      publishedAt: '2024-01-05',
      readTime: 6,
      featuredImage: '/images/tcm-digital-diagnosis.jpg',
      views: 756,
      likes: 45
    }
  ];

  return (
    <div className="min-h-screen bg-paper">
      <SEOHead 
        title={homeSeo.title}
        description={homeSeo.description}
        ogImage={ogHomeImage}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tcm-bronze/5 via-tcm-celadon/5 to-tcm-gold/5" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="ancient-title text-5xl md:text-7xl mb-6 text-tcm-ink">
              {t('home.title', '中华医典')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
              {t('home.tagline', '传承中医智慧 · 弘扬中华文化')}
              <br className="hidden md:block" />
              {t('home.description', '收录中国历代医学古籍1000部，卷帙上万，4亿字')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/library" search={{ category: 'all' }}>
                <Button className="traditional-button-primary px-8 py-4 text-lg">
                  {t('home.actions.browseLibrary', '浏览古籍库')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/search" search={{ type: 'all' }}>
                <Button variant="outline" className="traditional-button-outline px-8 py-4 text-lg border-tcm-bronze/30 text-tcm-bronze hover:bg-tcm-bronze/10">
                  {t('home.actions.search', '智能检索')}
                  <Search className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="ancient-card rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="ancient-title text-3xl font-bold mb-4 text-tcm-ink">{t('home.stats.title', '数据概览')}</h2>
            <p className="text-xl text-muted-foreground">{t('home.stats.subtitle', '中华医典的丰富资源')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredStats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`mx-auto w-20 h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-tcm-ink mb-2">{stat.value}</div>
                <div className="text-lg text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground/80">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="ancient-title text-3xl md:text-4xl font-bold mb-4 text-tcm-ink">{t('home.features.title', '核心功能')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('home.features.subtitle', '专业的中医古籍数字化平台，为您提供全方位的学术研究工具')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.href}>
              <Card className="ancient-card group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 bg-tcm-bronze/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-tcm-bronze/20 transition-colors`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="ancient-title text-xl text-tcm-ink">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="ancient-title text-3xl md:text-4xl font-bold mb-4 text-tcm-ink">{t('home.blog.title', '学术博客')}</h2>
            <p className="text-xl text-muted-foreground">{t('home.blog.subtitle', '传承中医智慧，分享学术心得')}</p>
          </div>
          <Link to="/blog" search={{ category: 'all' }}>
            <Button variant="outline" className="traditional-button-outline border-tcm-bronze/30 text-tcm-bronze hover:bg-tcm-bronze/10">
              {t('home.blog.viewAll', '查看全部')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <TCMBlogCard
              key={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              slug={article.slug}
              category={article.category}
              publishedAt={article.publishedAt}
              readTime={article.readTime}
              featuredImage={article.featuredImage}
              views={article.views}
              likes={article.likes}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="ancient-card bg-gradient-to-r from-tcm-bronze/10 to-tcm-celadon/10 border-tcm-bronze/20 rounded-3xl p-12 text-center">
          <h2 className="ancient-title text-3xl md:text-4xl font-bold mb-6 text-tcm-ink">
            {t('home.cta.title', '开始探索中医古籍的智慧')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle', '加入我们，一起传承和弘扬中华传统医学文化')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/library" search={{ category: 'all' }}>
              <Button className="traditional-button-primary px-8 py-4 text-lg">
                {t('home.actions.getStart', '立即开始')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about" search={{}}>
              <Button variant="outline" className="traditional-button-outline px-8 py-4 text-lg border-tcm-bronze/30 text-tcm-bronze hover:bg-tcm-bronze/10">
                {t('home.actions.learnMore', '了解更多')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnifiedTCMIndex;
