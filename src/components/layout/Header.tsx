import { useState } from 'react';
import { useLocation } from "@tanstack/react-router";
import { Menu, BookOpen, Search, GraduationCap, Info, Package, Phone } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { getSiteName } from '@/config/site';
import { Button } from "@/components/ui/button";
import LangLink from '@/components/molecules/LangLink';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent } from "@/components/ui/menubar";
import { SITE_NAVIGATION } from '@/config/siteNavigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const siteName = getSiteName(i18n.language as 'en' | 'zh');

  // 从locales动态加载导航配置
  const navItems = [
    { key: 'library', label: t('header.library'), href: '/library', icon: BookOpen },
    { key: 'search', label: t('header.search'), href: '/search', icon: Search },
    { key: 'research', label: t('header.research'), href: '/research', icon: GraduationCap },
    { key: 'about', label: t('header.about'), href: '/about', icon: Info },
    { key: 'resources', label: t('header.resources'), href: '/resources', icon: Package },
    { key: 'contact', label: t('header.contact'), href: '/contact', icon: Phone }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <LangLink to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-90 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">{siteName}</span>
          </LangLink>
          
          <div className="hidden md:flex items-center space-x-2">
            <Menubar className="bg-transparent border-0 p-0 h-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const submenus = SITE_NAVIGATION.submenus;
                const sub = (submenus?.[item.key as keyof typeof submenus]) || [];
                const topHref = SITE_NAVIGATION.items[item.key as keyof typeof SITE_NAVIGATION.items]?.href || item.href;
                
                if (sub.length === 0) {
                  return (
                    <LangLink
                      key={item.key}
                      to={topHref}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </LangLink>
                  );
                }
                
                return (
                  <MenubarMenu key={item.key}>
                    <MenubarTrigger className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </MenubarTrigger>
                    <MenubarContent className="min-w-[200px]">
                      {sub.map((subItem, index) => (
                        <LangLink
                          key={index}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                        >
                          {t(subItem.labelKey)}
                        </LangLink>
                      ))}
                    </MenubarContent>
                  </MenubarMenu>
                );
              })}
            </Menubar>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const submenus = SITE_NAVIGATION.submenus;
                    const sub = (submenus?.[item.key as keyof typeof submenus]) || [];
                    const topHref = SITE_NAVIGATION.items[item.key as keyof typeof SITE_NAVIGATION.items]?.href || item.href;
                    
                    return (
                      <div key={item.key} className="space-y-2">
                        <LangLink
                          to={topHref}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </LangLink>
                        {sub.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {sub.map((subItem, index) => (
                              <LangLink
                                key={index}
                                to={subItem.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              >
                                {t(subItem.labelKey)}
                              </LangLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
