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
  CheckCircle
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { generateWebsiteSchema, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import { getSiteName, SITE_CONFIG } from "@/config/site";
import ogHomeImage from "@/assets/og-home.jpg";

const TCMIndex = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'zh';
  const siteName = getSiteName(currentLang);

  const homeSeo = {
    title: '中华医典 - 传承中医智慧，弘扬中华文化',
    description: '收录中国历代医学古籍1000部，卷帙上万，4亿字，汇集了新中国成立前的历代主要中医著作',
  };
  
  const structuredData = [
    generateWebsiteSchema(),
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { label: '首页', href: '/' }
    ])
  ];

  const featuredStats = [
    { 
      label: '古籍总数', 
      value: '1000+', 
      icon: BookOpen, 
      color: "text-primary",
      bgColor: "bg-primary/10",
      desc: '涵盖历代主要中医著作'
    },
    { 
      label: '总字数', 
      value: '4亿+', 
      icon: Globe, 
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      desc: '珍贵医学文献资料'
    },
    { 
      label: '研究论文', 
      value: '83+', 
      icon: Award, 
      color: "text-primary",
      bgColor: "bg-primary/10",
      desc: '基于古籍的学术研究'
    },
    { 
      label: '分类目录', 
      value: '12', 
      icon: Brain, 
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      desc: '系统化医学分类'
    }
  ];

  const categoryLinks = [
    {
      title: '古籍库',
      description: '浏览1000+部中医古籍，包括医经、本草、方书等',
      icon: BookOpen,
      href: "/library",
      color: "bg-primary hover:bg-primary/90",
      count: '1000+ 部古籍',
      badge: '核心'
    },
    {
      title: '智能检索',
      description: 'AI驱动的语义搜索，支持症状、方剂、药材查询',
      icon: Search,
      href: "/search",
      color: "bg-secondary hover:bg-secondary/90",
      count: '智能搜索',
      badge: 'AI'
    },
    {
      title: '学术研究',
      description: '基于古籍的深度学术研究和论文发表平台',
      icon: Award,
      href: "/research",
      color: "bg-primary hover:bg-primary/90",
      count: '83+ 篇论文',
      badge: null
    },
    {
      title: '关于我们',
      description: '了解中华医典项目的历史、使命和愿景',
      icon: Users,
      href: "/about",
      color: "bg-secondary hover:bg-secondary/90",
      count: '项目介绍',
      badge: null
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: '权威收录',
      description: '汇集新中国成立前的历代主要中医著作，确保内容的权威性和完整性'
    },
    {
      icon: Star,
      title: '专业整理',
      description: '由中医专家团队精心整理和校对，保证文献的准确性和可读性'
    },
    {
      icon: Brain,
      title: '智能检索',
      description: '基于AI技术的智能搜索系统，支持语义理解和精准匹配'
    },
    {
      icon: Users,
      title: '学术支持',
      description: '为中医研究者和学习者提供强大的学术支持和研究工具'
    }
  ];

  const dynasties = [
    { name: '先秦', count: 15, description: '中医理论奠基时期' },
    { name: '两汉', count: 28, description: '张仲景《伤寒杂病论》' },
    { name: '魏晋南北朝', count: 45, description: '王叔和《脉经》、皇甫谧《针灸甲乙经》' },
    { name: '隋唐', count: 67, description: '孙思邈《千金要方》《千金翼方》' },
    { name: '宋金元', count: 156, description: '金元四大家学术争鸣' },
    { name: '明清', count: 389, description: '李时珍《本草纲目》、温病学派' }
  ];

  return (
    <main id="main" className="min-h-screen bg-background">
      <SEOHead 
        structuredData={structuredData}
        ogImage={`${SITE_CONFIG.url}${ogHomeImage}`}
      />
      
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-1.5 text-sm">
                🏛️ 传承千年中医智慧
              </Badge>
            </div>
            <Heading level={1} className="ancient-title text-5xl md:text-7xl mb-6">
              中华医典
              <span className="block text-2xl md:text-3xl mt-4 text-muted-foreground font-normal">
                传承中医智慧 · 弘扬中华文化
              </span>
            </Heading>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
              收录中国历代医学古籍1000部，卷帙上万，4亿字
              <br className="hidden md:block" />
              汇集了新中国成立前的历代主要中医著作
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {features.slice(0, 3).map((feature) => (
                <Badge key={feature.title} className="bg-muted text-foreground hover:bg-muted/80 px-4 py-2 text-sm rounded-full">
                  <feature.icon className="w-4 h-4 mr-2" />
                  {feature.title}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/library">
                <Button size="lg" className="scroll-btn text-lg px-8 py-6 h-auto">
                  <BookOpen className="w-5 h-5 mr-2" />
                  浏览古籍库
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto rounded-full border-2 hover:bg-accent/50">
                  <Search className="w-5 h-5 mr-2" />
                  智能检索
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 paper-card rounded-3xl shadow-xl mb-16">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">数据概览</Heading>
            <p className="text-xl text-muted-foreground">中华医典的丰富资源</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
            {featuredStats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`mx-auto w-20 h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 transition-colors`}>
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-muted-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground/80">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-16">
          <div className="text-center mb-16">
            <Heading level={2} className="mb-6 tracking-tight">功能导航</Heading>
            <p className="text-xl text-muted-foreground font-light">探索中华医典的强大功能</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryLinks.map((link, index) => (
              <Link key={index} to={link.href} className="group">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
                  {link.badge && (
                    <Badge className="absolute top-4 right-4 z-10 bg-secondary text-white shadow-md">
                      {link.badge}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4 relative">
                    <div className={`mx-auto w-20 h-20 ${link.color} rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl`}>
                      <link.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors font-bold">
                      {link.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <p className="text-muted-foreground mb-4 leading-relaxed">{link.description}</p>
                    <div className="text-sm text-primary font-bold bg-primary/5 py-1.5 px-3 rounded-full inline-block">{link.count}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Dynasties Section */}
        <section className="py-16 paper-card rounded-3xl shadow-xl mb-16">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">历代医学</Heading>
            <p className="text-xl text-muted-foreground">跨越两千年的医学传承</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {dynasties.map((dynasty, index) => (
              <div key={index} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">{dynasty.name}</span>
                </div>
                <div className="text-xl font-bold text-foreground mb-2">{dynasty.count} 部</div>
                <div className="text-sm text-muted-foreground">{dynasty.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Heading level={2} className="mb-6 tracking-tight">核心特色</Heading>
            <p className="text-xl text-muted-foreground font-light">中华医典的独特优势</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all shadow-sm group-hover:shadow-md">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed px-4">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center paper-card rounded-[3rem] shadow-2xl mb-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
          <div className="max-w-4xl mx-auto px-8">
            <Heading level={2} className="ancient-title text-4xl md:text-5xl mb-8 tracking-tight">开始探索中医智慧</Heading>
            <p className="text-xl md:text-2xl mb-12 text-muted-foreground leading-relaxed font-light">
              加入我们，共同传承和发扬中华医学的宝贵遗产
              <br className="mt-2" />
              <span className="font-medium text-foreground">
                1000+ 部古籍 · 4亿+ 文字 · 12 个分类
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/library">
                <Button size="lg" className="scroll-btn text-lg px-10 py-7 h-auto">
                  <BookOpen className="w-6 h-6 mr-3" />
                  开始浏览
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto rounded-full border-2 hover:bg-accent/50">
                  <Search className="w-6 h-6 mr-3" />
                  智能搜索
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TCMIndex;
