
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "@tanstack/react-router";
import LanguageRouteProvider from './components/LanguageRouteProvider';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from '@/components/molecules/ErrorBoundary';
import { initializeTracking } from './lib/tracking';
import { useEffect } from 'react';
import { SkipToContent } from "@/components/atoms";
import ScrollToTop from "@/components/ScrollToTop";

// 开发环境下导入测试
if (import.meta.env.DEV) {
  import('./utils/validateLucideIcons');
}

const App = () => {
  useEffect(() => {
    // 初始化所有追踪和安全配置
    initializeTracking();
  }, []);
  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <LanguageRouteProvider>
            <ScrollToTop />
            <SkipToContent />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main id="main-content" className="flex-grow relative z-10">
                <Outlet />
              </main>
              <Footer />
            </div>
          </LanguageRouteProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </>
  )
};
 
export default App;
