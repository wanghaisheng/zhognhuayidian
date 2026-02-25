import { LANGUAGES } from '@/config/language';

export const addLangPath = (basePath: string) => {
  return LANGUAGES.map(lang => {
    if (lang.prefix === '') return basePath;
    if (basePath === '/') return lang.prefix;
    return `${lang.prefix}${basePath}`;
  });
}
