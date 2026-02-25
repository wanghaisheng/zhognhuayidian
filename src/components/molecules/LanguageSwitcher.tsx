import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelectorModal } from '@/components/molecules/LanguageSelectorModal';
import { LANGUAGES } from '@/config/language';
import { useLanguageRoutes } from '@/hooks/useLanguageRoutes';

const FLAG_MAP: Record<string, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ar: '🇸🇦',
};

const LanguageSwitcher = () => {
  const { currentLanguage } = useLanguageRoutes();

  const currentLangConfig = LANGUAGES.find(lang => lang.code === currentLanguage);
  const flag = FLAG_MAP[currentLanguage] || '🌐';
  const displayName = currentLangConfig?.name || currentLanguage.toUpperCase();

  return (
    <LanguageSelectorModal 
      trigger={
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 px-3 gap-2"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{flag} {displayName}</span>
          <span className="sm:hidden">{flag}</span>
        </Button>
      }
    />
  );
};

export default LanguageSwitcher;
