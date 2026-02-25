import React from 'react'
import { TCMNavigation } from './TCMNavigation'

interface TCMLayoutProps {
  children: React.ReactNode
}

export const TCMLayout: React.FC<TCMLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-paper">
      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 hidden md:block tcm-sidebar">
          <TCMNavigation />
        </aside>
        
        {/* 主内容区 */}
        <main className="flex-1">
          {/* 移动端导航 */}
          <div className="md:hidden">
            <TCMNavigation />
          </div>
          
          {/* 页面内容 */}
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
