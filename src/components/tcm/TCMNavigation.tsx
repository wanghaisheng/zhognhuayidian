import React from 'react'
import { Link } from '@tanstack/react-router'
import { 
  BookOpen, 
  Search, 
  Brain, 
  Award, 
  Home, 
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface TCMNavigationProps {
  className?: string
}

export const TCMNavigation: React.FC<TCMNavigationProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      name: '首页',
      href: '/',
      icon: Home,
      description: '返回首页'
    },
    {
      name: '古籍库',
      href: '/library',
      icon: BookOpen,
      description: '浏览1000+部中医古籍'
    },
    {
      name: '智能检索',
      href: '/search',
      icon: Search,
      description: 'AI驱动的智能搜索'
    },
    {
      name: '学术研究',
      href: '/research',
      icon: Award,
      description: '最新研究成果'
    }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className={`tcm-sidebar ${className}`}>
      {/* 桌面端导航 */}
      <div className="hidden md:block">
        <div className="p-6">
          <h2 className="ancient-title text-2xl mb-6">中华医典</h2>
          <p className="text-sm text-muted-foreground mb-8">
            传承中医智慧，弘扬中华文化
          </p>
        </div>
        
        <div className="px-4 pb-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="tcm-nav-link flex items-center gap-3 px-4 py-3 mb-2"
              activeProps={{
                className: 'tcm-nav-link active'
              }}
            >
              <item.icon className="w-5 h-5" />
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 移动端导航 */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-secondary/20">
          <h2 className="ancient-title text-xl">中华医典</h2>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-secondary/20 z-50">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/5 transition-colors"
                activeProps={{
                  className: 'bg-primary/10 text-primary border-l-4 border-primary'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
