import * as React from 'react';

const IndexPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl mb-6 font-bold text-gradient-tcm">
              中华医典
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
              传承中医智慧 · 弘扬中华文化
              <br className="hidden md:block" />
              收录中国历代医学古籍1000部，卷帙上万，4亿字
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="/library">
                <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  浏览古籍库
                </button>
              </a>
              <a href="/search">
                <button className="px-8 py-4 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary/10 transition-all duration-300">
                  智能检索
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 paper-card rounded-3xl shadow-xl mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">数据概览</h2>
            <p className="text-xl text-muted-foreground">中华医典的丰富资源</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">1000+</div>
              <div className="text-lg text-muted-foreground mb-1">古籍总数</div>
              <div className="text-sm text-muted-foreground/80">涵盖历代主要中医著作</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">4亿+</div>
              <div className="text-lg text-muted-foreground mb-1">总字数</div>
              <div className="text-sm text-muted-foreground/80">珍贵医学文献资料</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">83+</div>
              <div className="text-lg text-muted-foreground mb-1">研究论文</div>
              <div className="text-sm text-muted-foreground/80">基于古籍的学术研究</div>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📂</span>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">12</div>
              <div className="text-lg text-muted-foreground mb-1">分类目录</div>
              <div className="text-sm text-muted-foreground/80">系统化医学分类</div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">功能导航</h2>
            <p className="text-xl text-muted-foreground">探索中华医典的强大功能</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <a href="/library" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-primary transition-colors">古籍库</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">浏览1000+部中医古籍，包括医经、本草、方书等</p>
                <div className="text-sm text-primary font-bold bg-primary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">1000+ 部古籍</div>
              </div>
            </a>

            <a href="/search" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-secondary transition-colors">智能检索</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">AI驱动的语义搜索，支持症状、方剂、药材查询</p>
                <div className="text-sm text-secondary font-bold bg-secondary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">智能搜索</div>
              </div>
            </a>

            <a href="/research" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-primary transition-colors">学术研究</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">基于古籍的深度学术研究和论文发表平台</p>
                <div className="text-sm text-primary font-bold bg-primary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">83+ 篇论文</div>
              </div>
            </a>

            <a href="/about" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">ℹ️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-secondary transition-colors">关于我们</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">了解中华医典的使命和愿景</p>
                <div className="text-sm text-secondary font-bold bg-secondary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">项目介绍</div>
              </div>
            </a>
          </div>
        </section>

        {/* Featured Books */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">经典古籍</h2>
            <p className="text-xl text-muted-foreground">中华医学的瑰宝</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="ancient-book-item">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-foreground flex-1 mr-2">黄帝内经</h3>
                <span className="dynasty-tag whitespace-nowrap">先秦</span>
              </div>
              
              <div className="text-sm text-muted-foreground mb-3 space-y-1">
                <div>作者：佚名</div>
                <div>成书年代：战国时期</div>
                <div>分类：<span className="tcm-tag">医经</span></div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                中国现存最早、最完整、最系统的中医理论著作，分为《素问》和《灵枢》两部分。它奠定了中医学理论基础，包括阴阳五行、脏腑经络、病因病机、诊法治则等。
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tcm-tag text-xs">基础理论</span>
                <span className="tcm-tag text-xs">内经</span>
                <span className="tcm-tag text-xs">先秦医学</span>
                <span className="tcm-tag text-xs">阴阳五行</span>
              </div>
              
              <button className="scroll-btn w-full">
                阅读古籍
              </button>
            </div>

            <div className="ancient-book-item">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-foreground flex-1 mr-2">伤寒杂病论</h3>
                <span className="dynasty-tag whitespace-nowrap">东汉</span>
              </div>
              
              <div className="text-sm text-muted-foreground mb-3 space-y-1">
                <div>作者：张仲景</div>
                <div>成书年代：200年</div>
                <div>分类：<span className="tcm-tag">伤寒金匮</span></div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                东汉张仲景所著，是中医辨证论治的奠基之作。原书16卷，后世整理为《伤寒论》和《金匮要略》两部分，确立了六经辨证和脏腑辨证的诊疗体系。
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tcm-tag text-xs">伤寒</span>
                <span className="tcm-tag text-xs">杂病</span>
                <span className="tcm-tag text-xs">辨证论治</span>
                <span className="tcm-tag text-xs">张仲景</span>
              </div>
              
              <button className="scroll-btn w-full">
                阅读古籍
              </button>
            </div>

            <div className="ancient-book-item">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-foreground flex-1 mr-2">本草纲目</h3>
                <span className="dynasty-tag whitespace-nowrap">明</span>
              </div>
              
              <div className="text-sm text-muted-foreground mb-3 space-y-1">
                <div>作者：李时珍</div>
                <div>成书年代：1596年</div>
                <div>分类：<span className="tcm-tag">本草</span></div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                明代李时珍历时27年编成的药物学巨著，收录药物1892种，方剂11096首，附图1109幅。是中国古代药物学的集大成之作。
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tcm-tag text-xs">药物学</span>
                <span className="tcm-tag text-xs">本草学</span>
                <span className="tcm-tag text-xs">李时珍</span>
                <span className="tcm-tag text-xs">明代医学</span>
              </div>
              
              <button className="scroll-btn w-full">
                阅读古籍
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default IndexPage;
