import React, { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getLanguageConfig } from '@/config/language';
import { getLanguageFromPath, migrateOldEnUrl } from '@/utils/multilingualRoutes';

interface LanguageRouteProviderProps {
  children: React.ReactNode;
}

/**
 * LanguageRouteProvider
 * 
 * 职责：
 * 1. 检测 URL 中的语言并同步到 i18n
 * 2. 处理旧 /en/* URL 格式迁移
 * 3. 设置文档语言方向 (LTR/RTL)
 * 
 * 注意：Trailing slash 处理已移至边缘层 (Cloudflare Pages)
 * 见 public/redirects.md - 避免客户端和边缘层重复处理导致的 GSC 问题
 */
const LanguageRouteProvider: React.FC<LanguageRouteProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const pathname = location.pathname;
    const search = location.search;
    
    // Step 1: Detect old /en/* URL format and redirect to new format (no prefix)
    // 这是必要的客户端重定向，因为可能有旧链接直接访问
    const migratedPath = migrateOldEnUrl(pathname);
    if (migratedPath !== null) {
      navigate({ to: `${migratedPath}${search}`, replace: true });
      return;
    }
    
    // Step 2: Get language from URL
    const urlLanguage = getLanguageFromPath(pathname);
    
    // Step 3: Update i18n if URL language doesn't match current i18n language
    if (urlLanguage !== i18n.language) {
      i18n.changeLanguage(urlLanguage);
    }
    
    // Step 4: Set document direction (support RTL languages like Arabic)
    const langConfig = getLanguageConfig(urlLanguage);
    if (langConfig) {
      document.documentElement.dir = langConfig.dir;
      document.documentElement.lang = urlLanguage;
    }
  }, [location.pathname, location.search, i18n, navigate]);

  return <>{children}</>;
};

export default LanguageRouteProvider;
