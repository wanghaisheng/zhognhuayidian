import React from 'react'
import { Link } from "@tanstack/react-router"

const TCMIndexSimple = () => {
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
              <Link to="/library">
                <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  浏览古籍库
                </button>
              </Link>
              <Link to="/search">
                <button className="px-8 py-4 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary/10 transition-all duration-300">
                  智能检索
                </button>
              </Link>
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
            <Link to="/library" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-primary transition-colors">古籍库</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">浏览1000+部中医古籍，包括医经、本草、方书等</p>
                <div className="text-sm text-primary font-bold bg-primary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">1000+ 部古籍</div>
              </div>
            </Link>

            <Link to="/search" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-secondary transition-colors">智能检索</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">AI驱动的语义搜索，支持症状、方剂、药材查询</p>
                <div className="text-sm text-secondary font-bold bg-secondary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">智能搜索</div>
              </div>
            </Link>

            <Link to="/research" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-primary transition-colors">学术研究</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">基于古籍的深度学术研究和论文发表平台</p>
                <div className="text-sm text-primary font-bold bg-primary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">83+ 篇论文</div>
              </div>
            </Link>

            <Link to="/about" className="group">
              <div className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 rounded-lg p-6">
                <div className="mx-auto w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-6 transition-all shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl">ℹ️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center group-hover:text-secondary transition-colors">关于我们</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">了解中华医典项目的历史、使命和愿景</p>
                <div className="text-sm text-secondary font-bold bg-secondary/5 py-1.5 px-3 rounded-full inline-block w-full text-center">项目介绍</div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TCMIndexSimple;
