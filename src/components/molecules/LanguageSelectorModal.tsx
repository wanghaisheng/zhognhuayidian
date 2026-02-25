import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguageRoutes } from '@/hooks/useLanguageRoutes';
import { LANGUAGES, SupportedLanguage } from '@/config/language';

export const LanguageSelectorModal: React.FC<{ trigger?: React.ReactNode }> = ({ trigger }) => {
  const { switchLanguage, currentLanguage } = useLanguageRoutes();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleLanguageChange = (code: SupportedLanguage) => {
    switchLanguage(code);
    setOpen(false);
  };

  // Group languages by region
  const groupedLanguages = LANGUAGES.reduce((acc, lang) => {
    const region = lang.region || 'Other';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(lang);
    return acc;
  }, {} as Record<string, typeof LANGUAGES>);

  // Define region display order
  const regionOrder = ['Americas', 'Asia Pacific', 'Europe', 'Middle East & Africa', 'Other'];

  // Filter out regions that have no languages
  const activeRegions = regionOrder.filter(region => groupedLanguages[region] && groupedLanguages[region].length > 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t('common.changeRegion')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('common.selectYourRegion')}</DialogTitle>
          <DialogDescription>
            {t('common.chooseLanguageRegionDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mt-4 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-6">
            {activeRegions.map((regionName) => (
              <div key={regionName} className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  {regionName}
                </h3>
                <ul className="space-y-2">
                  {groupedLanguages[regionName].map((lang, index) => {
                    const key = `${regionName}-${lang.code}-${index}`;
                    const isActive = currentLanguage === lang.code;
                    
                    return (
                      <li key={key}>
                        <button
                          onClick={() => handleLanguageChange(lang.code as SupportedLanguage)}
                          className={`
                            group flex items-center justify-between w-full text-left py-2 px-3 rounded-md text-sm transition-colors
                            ${isActive 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'hover:bg-muted text-foreground'
                            }
                          `}
                        >
                          <div className="flex flex-col">
                            <span>{lang.name}</span>
                            <span className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                              {lang.country}
                            </span>
                          </div>
                          {isActive && <Check className="h-4 w-4" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
