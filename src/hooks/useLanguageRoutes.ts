import { useNavigate, useLocation } from '@tanstack/react-router';
import { SupportedLanguage } from '@/config/language';
import { getLanguageFromPath, removeLanguagePrefix, addLanguagePrefix } from '@/utils/multilingualRoutes';

export const useLanguageRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 语言切换时更新URL
  const switchLanguage = (newLanguage: SupportedLanguage) => {
    const currentPath = removeLanguagePrefix(location.pathname);
    const newPath = addLanguagePrefix(currentPath, newLanguage);
    
    // 正确处理TanStack Router的search参数
    let searchParams = {};
    
    // 检查location.search的类型并正确处理
    if (location.search) {
      if (typeof location.search === 'string') {
        // 如果是字符串，解析为对象
        const params = new URLSearchParams(location.search);
        params.forEach((value, key) => {
          searchParams[key] = value;
        });
      } else if (typeof location.search === 'object') {
        // 如果已经是对象，直接使用
        searchParams = location.search;
      }
    }
    
    navigate({
      to: newPath,
      search: searchParams,
      replace: true
    });
  };

  const pathLanguage = getLanguageFromPath(location.pathname) as SupportedLanguage;

  return {
    getCurrentLanguageFromPath: () => getLanguageFromPath(location.pathname),
    getPathWithoutLanguage: () => removeLanguagePrefix(location.pathname),
    addLanguageToPath: (pathname: string, language: SupportedLanguage) => addLanguagePrefix(pathname, language),
    switchLanguage,
    currentLanguage: pathLanguage,
    pathLanguage
  };
};
