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
import GlobalPresenceStats from '@/components/organisms/GlobalPresenceStats';
import { generateWebsiteSchema, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import { getSiteName, getDefaultSeoDescription, SITE_CONFIG } from "@/config/site";
import ogHomeImage from "@/assets/og-home.jpg";
import { useStats } from "@/hooks/useStats";
import { addLanguagePrefix } from '@/utils/multilingualRoutes';
import { SupportedLanguage } from '@/config/language';

const Index = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'zh';
  const siteName = getSiteName(currentLang);
  const { stats } = useStats();

  const homeSeo = {
    title: t('home.seo.title'),
    description: t('home.seo.description'),
  };
  
  // Generate comprehensive structured data for homepage
  const structuredData = [
    generateWebsiteSchema(),
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { label: t('common.home'), href: '/' }
    ])
  ];

  const growthMetrics = {
    devices: 0.15,
    manufacturers: 0.08,
    articles: 0.25,
    countries: 0.12
  };

  const formatGrowth = (value: number) => {
    const percent = Math.round(value * 100);
    return `+${percent}%`;
  };

  const featuredStats = [
    { 
      label: t('home.stats.globalDevices'), 
      value: stats.totalDevices, 
      icon: Monitor, 
      color: "text-info",
      bgColor: "bg-info/10",
      growthValue: growthMetrics.devices,
      desc: t('home.stats.descDevices')
    },
    { 
      label: t('home.stats.manufacturers'), 
      value: stats.totalManufacturers, 
      icon: Building, 
      color: "text-success",
      bgColor: "bg-success/10",
      growthValue: growthMetrics.manufacturers,
      desc: t('home.stats.descManufacturers')
    },
    { 
      label: t('home.stats.articles'), 
      value: stats.totalArticles, 
      icon: BookOpen, 
      color: "text-brand-secondary",
      bgColor: "bg-brand-secondary/10",
      growthValue: growthMetrics.articles,
      desc: t('home.stats.descArticles')
    },
    { 
      label: t('home.stats.countries'), 
      value: stats.totalCountries, 
      icon: Globe, 
      color: "text-warning",
      bgColor: "bg-warning/10",
      growthValue: growthMetrics.countries,
      desc: t('home.stats.descCountries')
    }
  ];

  const categoryLinks = [
    {
      title: t('home.categories.ct'),
      description: t('home.categories.ctDesc'),
      icon: Monitor,
      href: addLanguagePrefix("/ct-manufacturers", i18n.language as SupportedLanguage),
      color: "bg-info hover:bg-info/90",
      count: `${t('home.categories.ctCountValue')} ${t('home.categories.ctCount')}`,
      badge: t('home.categories.badgeHot')
    },
    {
      title: t('home.categories.mri'),
      description: t('home.categories.mriDesc'),
      icon: Target,
      href: addLanguagePrefix("/mri-manufacturers", i18n.language as SupportedLanguage),
      color: "bg-success hover:bg-success/90",
      count: `${t('home.categories.mriCountValue')} ${t('home.categories.mriCount')}`,
      badge: t('home.categories.badgeNew')
    },
    {
      title: t('home.categories.manufacturersTitle'),
      description: t('home.categories.manufacturersDesc'),
      icon: Building,
      href: addLanguagePrefix("/manufacturers", i18n.language as SupportedLanguage),
      color: "bg-brand-secondary hover:bg-brand-secondary/90",
      count: `${t('home.categories.manufacturersCountValue')} ${t('home.categories.manufacturersCount')}`,
      badge: null
    },
    {
      title: t('home.categories.marketTitle'),
      description: t('home.categories.marketDesc'),
      icon: TrendingUp,
      href: addLanguagePrefix("/reports", i18n.language as SupportedLanguage),
      color: "bg-warning hover:bg-warning/90",
      count: t('home.categories.marketCount'),
      badge: null
    }
  ];

  const specializedLinks = [
    {
      title: t('home.specialized.chinaCT'),
      description: t('home.specialized.chinaCTDesc'),
      href: addLanguagePrefix("/china-ct-manufacturers", i18n.language as SupportedLanguage),
      icon: Shield,
      highlight: true
    },
    {
      title: t('home.specialized.chinaMRI'), 
      description: t('home.specialized.chinaMRIDesc'),
      href: addLanguagePrefix("/china-mri-manufacturers", i18n.language as SupportedLanguage),
      icon: Zap,
      highlight: true
    },
    {
      title: t('home.specialized.expertAnalysis'),
      description: t('home.specialized.expertAnalysisDesc'),
      href: addLanguagePrefix("/reports/expert", i18n.language as SupportedLanguage),
      icon: Award,
      highlight: false
    },
    {
      title: t('home.specialized.guide'),
      description: t('home.specialized.guideDesc'),
      href: addLanguagePrefix("/resources", i18n.language as SupportedLanguage),
      icon: BookOpen,
      highlight: false
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: t('home.benefits.authoritative'),
      description: t('home.benefits.authoritativeDesc')
    },
    {
      icon: Star,
      title: t('home.benefits.professional'),
      description: t('home.benefits.professionalDesc')
    },
    {
      icon: Shield,
      title: t('home.benefits.realtime'),
      description: t('home.benefits.realtimeDesc')
    },
    {
      icon: Users,
      title: t('home.benefits.expert'),
      description: t('home.benefits.expertDesc')
    }
  ];

  return (
    <main id="main" className="min-h-screen bg-background">
      <SEOHead 
        structuredData={structuredData}
        ogImage={`${SITE_CONFIG.url}${ogHomeImage}`}
      />
      
      <div className="container mx-auto px-4">
        {/* Hero Section - Enhanced */}
        <section className="text-center py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-1.5 text-sm">
                🔥 {t('home.hero.badge')}
              </Badge>
            </div>
            <Heading level={1} className="text-5xl md:text-7xl mb-6 tracking-tight font-extrabold text-foreground">
              {t('home.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-secondary mt-2 pb-2">
                {t('home.hero.titleHighlight')}
              </span>
            </Heading>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto font-light">
              {t('home.hero.subtitle')}
              <br className="hidden md:block" />
              {t('home.hero.subtitleLine2')}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {benefits.slice(0, 3).map((benefit) => (
                <Badge key={benefit.title} className="bg-muted text-foreground hover:bg-muted/80 px-4 py-2 text-sm rounded-full">
                  <benefit.icon className="w-4 h-4 mr-2" />
                  {benefit.title}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={addLanguagePrefix('/devices', i18n.language as SupportedLanguage)}>
                <Button size="lg" className="text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-primary hover:bg-primary/90">
                  <Monitor className="w-5 h-5 mr-2" />
                  {t('home.hero.browseDevices')}
                </Button>
              </Link>
              <Link to={addLanguagePrefix('/ct-manufacturers', i18n.language as SupportedLanguage)}>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto rounded-full border-2 hover:bg-accent/50">
                  <Building className="w-5 h-5 mr-2" />
                  {t('home.hero.viewManufacturers')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-16 bg-card rounded-3xl shadow-xl mb-16 border border-border/50">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">{t('home.stats.title')}</Heading>
            <p className="text-xl text-muted-foreground">{t('home.stats.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
            {featuredStats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`mx-auto w-20 h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 transition-colors`}>
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                  {stat.value}
                  <span className="text-sm text-success bg-success/10 px-2 py-1 rounded-full">
                    {formatGrowth(stat.growthValue as number)}
                  </span>
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

        <section className="py-16 bg-card rounded-3xl shadow-xl mb-16 border border-border/50">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">{t('home.chinaChoice.title')}</Heading>
            <p className="text-xl text-muted-foreground">{t('home.chinaChoice.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaChoice.parity')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaChoice.parityDesc')}</div>
            </div>
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-warning/20 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-10 h-10 text-warning" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaChoice.tco')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaChoice.tcoDesc')}</div>
            </div>
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-success/10 dark:bg-success/20 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-success" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaChoice.service')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaChoice.serviceDesc')}</div>
            </div>
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-brand-secondary/10 dark:bg-brand-secondary/20 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-10 h-10 text-brand-secondary" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaChoice.upgrade')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaChoice.upgradeDesc')}</div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={addLanguagePrefix('/china-ct-manufacturers', i18n.language as SupportedLanguage)}>
              <Button size="lg" className="rounded-full">
                <Shield className="w-5 h-5 mr-2" />
                {t('home.chinaChoice.viewChinaCTManufacturers')}
              </Button>
            </Link>
            <Link to={addLanguagePrefix('/china-mri-manufacturers', i18n.language as SupportedLanguage)}>
              <Button size="lg" variant="outline" className="rounded-full">
                <Zap className="w-5 h-5 mr-2" />
                {t('home.chinaChoice.viewChinaMRImanufacturers')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Global Presence Stats */}
        {/* <GlobalPresenceStats /> */}

        {/* Chinese Medical Equipment Global Impact */}
        <section className="py-16 bg-card rounded-3xl shadow-xl mb-16 border border-border/50">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              {t('home.globalStats.title')}
            </Heading>
            <p className="text-xl text-muted-foreground">
              {t('home.globalStats.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
            <div className="text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="mx-auto w-24 h-24 bg-success/10 dark:bg-success/20 rounded-3xl flex items-center justify-center mb-6 transition-colors shadow-sm group-hover:shadow-md">
                <Globe className="w-10 h-10 text-success" />
              </div>
                <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-2 tracking-tight">{t('home.globalStats.countriesExportedValue')}</div>
              <div className="text-lg font-semibold text-muted-foreground mb-2">
                {t('home.globalStats.countriesExported')}
              </div>
              <div className="text-sm text-muted-foreground/80 leading-relaxed px-4">
                {t('home.globalStats.countriesExportedDesc')}
              </div>
            </div>

            <div className="text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="mx-auto w-24 h-24 bg-info/10 dark:bg-info/20 rounded-3xl flex items-center justify-center mb-6 transition-colors shadow-sm group-hover:shadow-md">
                <Building className="w-10 h-10 text-info" />
              </div>
                <div className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">{t('home.globalStats.internationalInstallationsValue')}</div>
              <div className="text-lg font-semibold text-muted-foreground mb-2">
                {t('home.globalStats.internationalInstallations')}
              </div>
              <div className="text-sm text-muted-foreground/80 leading-relaxed px-4">
                {t('home.globalStats.internationalInstallationsDesc')}
              </div>
            </div>

            <div className="text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="mx-auto w-24 h-24 bg-warning/10 dark:bg-warning/20 rounded-3xl flex items-center justify-center mb-6 transition-colors shadow-sm group-hover:shadow-md">
                <TrendingUp className="w-10 h-10 text-warning" />
              </div>
                <div className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">{t('home.globalStats.costSavingsValue')}</div>
              <div className="text-lg font-semibold text-muted-foreground mb-2">
                {t('home.globalStats.costSavings')}
              </div>
              <div className="text-sm text-muted-foreground/80 leading-relaxed px-4">
                {t('home.globalStats.costSavingsDesc')}
              </div>
            </div>

            <div className="text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="mx-auto w-24 h-24 bg-brand-secondary/10 dark:bg-brand-secondary/20 rounded-3xl flex items-center justify-center mb-6 transition-colors shadow-sm group-hover:shadow-md">
                <Award className="w-10 h-10 text-brand-secondary" />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
                  <span className="text-xl md:text-2xl">{t('home.globalStats.internationalCertificationsValue')}</span>
              </div>
              <div className="text-lg font-semibold text-muted-foreground mb-2">
                {t('home.globalStats.internationalCertifications')}
              </div>
              <div className="text-sm text-muted-foreground/80 leading-relaxed px-4">
                {t('home.globalStats.internationalCertificationsDesc')}
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-info/10 to-brand-secondary/10 dark:from-info/20 dark:to-brand-secondary/20 px-8 py-4 rounded-full border border-info/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-info"></span>
                </span>
                <span className="text-info font-bold tracking-wide text-lg">
                  {t('home.globalStats.madeInChinaBadge')}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card rounded-3xl shadow-xl mb-16 border border-border/50">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">{t('home.chinaFAQ.title')}</Heading>
            <p className="text-xl text-muted-foreground">{t('home.chinaFAQ.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-info/10 dark:bg-info/20 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-10 h-10 text-info" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaFAQ.compliance')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaFAQ.complianceDesc')}</div>
            </div>
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-brand-secondary/10 dark:bg-brand-secondary/20 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-brand-secondary" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaFAQ.clinical')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaFAQ.clinicalDesc')}</div>
            </div>
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-success/10 dark:bg-success/20 rounded-2xl flex items-center justify-center mb-4">
                <PieChart className="w-10 h-10 text-success" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaFAQ.interoperability')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaFAQ.interoperabilityDesc')}</div>
            </div>
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-warning/10 dark:bg-warning/20 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-warning" />
              </div>
              <div className="text-xl font-bold text-foreground mb-2">{t('home.chinaFAQ.financing')}</div>
              <div className="text-sm text-muted-foreground">{t('home.chinaFAQ.financingDesc')}</div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={addLanguagePrefix('/resources', i18n.language as SupportedLanguage)}>
              <Button size="lg" className="rounded-full">
                <BookOpen className="w-5 h-5 mr-2" />
                {t('home.chinaFAQ.viewCertsCases')}
              </Button>
            </Link>
            <Link to={addLanguagePrefix('/contact', i18n.language as SupportedLanguage)}>
              <Button size="lg" variant="outline" className="rounded-full">
                <Users className="w-5 h-5 mr-2" />
                {t('home.chinaFAQ.consultExpertsCta')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Enhanced Category Navigation */}
        <section className="py-16">
          <div className="text-center mb-16">
            <Heading level={2} className="mb-6 tracking-tight">{t('home.categories.title')}</Heading>
            <p className="text-xl text-muted-foreground font-light">{t('home.categories.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryLinks.map((link, index) => (
              <Link key={index} to={link.href} className="group">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
                  {link.badge && (
                    <Badge className="absolute top-4 right-4 z-10 bg-warning text-white shadow-md">
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

        {/* Specialized Links Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <Heading level={2} className="mb-6 tracking-tight">{t('home.specialized.title')}</Heading>
            <p className="text-xl text-muted-foreground font-light">{t('home.specialized.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {specializedLinks.map((link, index) => (
              <Link key={index} to={link.href} className="group">
                <Card className={`h-full hover:shadow-xl transition-all duration-300 border-border/50 backdrop-blur-sm bg-card/50 hover:-translate-y-1 ${
                  link.highlight 
                    ? 'border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-brand-secondary/5 dark:from-primary/10 dark:to-brand-secondary/10' 
                    : 'hover:border-primary/30'
                }`}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 ${
                        link.highlight 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'bg-primary/10 text-primary'
                      } rounded-2xl flex items-center justify-center transition-all group-hover:scale-110`}>
                        <link.icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {link.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{link.description}</p>
                      </div>
                      <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Heading level={2} className="mb-6 tracking-tight">{t('home.benefits.title')}</Heading>
            <p className="text-xl text-muted-foreground font-light">{t('home.benefits.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all shadow-sm group-hover:shadow-md">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed px-4">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 text-center bg-card/50 backdrop-blur-xl rounded-[3rem] shadow-2xl mb-24 border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent -z-10"></div>
          <div className="max-w-4xl mx-auto px-8">
            <Heading level={2} className="text-4xl md:text-5xl mb-8 text-foreground tracking-tight font-extrabold">{t('home.cta.title')}</Heading>
            <p className="text-xl md:text-2xl mb-12 text-muted-foreground leading-relaxed font-light">
              {t('home.cta.subtitle')}
              <br className="mt-2" />
              <span className="font-medium text-foreground">
                {t('home.cta.stats', { 
                  deviceCount: stats.totalDevices, 
                  manufacturerCount: stats.totalManufacturers, 
                  subtitleCount: t('home.cta.subtitleCount') 
                })}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to={addLanguagePrefix('/devices', i18n.language as SupportedLanguage)}>
                <Button size="lg" className="text-lg px-10 py-7 h-auto rounded-full shadow-xl hover:shadow-2xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1">
                  <Search className="w-6 h-6 mr-3" />
                  {t('home.cta.searchDevices')}
                </Button>
              </Link>
              <Link to={addLanguagePrefix('/reports', i18n.language as SupportedLanguage)}>
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto rounded-full border-2 hover:bg-accent/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-background/50">
                  <Users className="w-6 h-6 mr-3" />
                  {t('home.cta.consultExperts')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Index;
