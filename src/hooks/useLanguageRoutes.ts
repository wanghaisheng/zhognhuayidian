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
    const searchValue = location.search as unknown;
    const searchStr = (() => {
      if (typeof searchValue === 'string') {
        return searchValue;
      }
      if (searchValue && typeof searchValue === 'object') {
        try {
          const params = new URLSearchParams(searchValue as Record<string, string>);
          const qs = params.toString();
          return qs ? `?${qs}` : '';
        } catch {
          return '';
        }
      }
      if (typeof window !== 'undefined' && typeof window.location?.search === 'string') {
        return window.location.search;
      }
      return '';
    })();
    const newUrl = `${newPath}${searchStr}`;

    if (newUrl !== `${location.pathname}${location.search}`) {
      navigate({ to: newUrl, replace: true });
    }
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
