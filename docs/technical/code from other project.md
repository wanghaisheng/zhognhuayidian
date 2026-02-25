
 import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { createRootRouteWithContext, Outlet, useLocation, HeadContent, Scripts, useRouter, useMatches } from '@tanstack/react-router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EmailModal from '../components/EmailModal';
import Chatbot from '../components/Chatbot';
import NotFound from '../components/NotFound';
import { ChatBubbleOvalLeftEllipsisIcon } from '../components/Icons';
import { getGlobalSchema } from '../utils/schemas';
import type { AppContextType } from '../types/index';
import { AppContext } from '../context/AppContext';
import { 
  subscribe, 
  getLocale, 
  initI18n, 
  stripLocaleFromPath,
  SUPPORTED_LOCALES,
  HREFLANG_MAP,
  getLocaleURL,
  getLocaleFromPath,
  DEFAULT_LOCALE,
  t
} from '../i18n';
import { SITE_URL } from '../siteConfig';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import LanguageSwitchBanner from '@/components/LanguageSwitchBanner';

interface RouterContext {
  head: string
  title?: string
  location?: any
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  head: (ctx) => {
    // Attempt to find location in matches
    const matchWithLocation = ctx.matches?.find((m: any) => m.location);
    // Try to get location from router context (injected in entry-server.tsx)
    const contextLocation = (ctx.match as any)?.context?.location;
    // Try to get location from router state directly (most reliable in SSR)
    // @ts-expect-error -- TanStack Router state access
    const routerLocation = ctx.router?.state?.location;
    
    // @ts-expect-error -- Combined location fallback
    const location = routerLocation || contextLocation || ctx.location || matchWithLocation?.location || (typeof window !== 'undefined' ? { pathname: window.location.pathname } : { pathname: '/' });
    
    // Debug logging for SSR
    if (typeof window === 'undefined') {
      // @ts-expect-error -- SSR debug logging
      console.log(`[SSR Debug] __root head: URL=${location.pathname}, Found via: ${routerLocation ? 'router.state' : (contextLocation ? 'context' : (ctx.location ? 'ctx.location' : (matchWithLocation ? 'match' : 'FALLBACK')))}`);
    }

    const cleanPath = stripLocaleFromPath(location.pathname);
    const links: any[] = SUPPORTED_LOCALES.map(locale => {
      const localePath = getLocaleURL(cleanPath, locale);
      const hreflang = HREFLANG_MAP[locale];
      return {
        rel: 'alternate',
        hreflang: hreflang, // Use lowercase hreflang to ensure it renders
        href: `${SITE_URL}${localePath}`
      };
    });
    
    links.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath + '/'}`
    });

    // Add canonical URL (Centralized handling)
    const currentLocale = getLocaleFromPath(location.pathname) || DEFAULT_LOCALE;
    const canonicalPath = getLocaleURL(cleanPath, currentLocale);
    
    links.push({
      rel: 'canonical',
      href: `${SITE_URL}${canonicalPath}`
    });

    // Add favicon and fonts
    links.push(
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Playfair+Display:wght@400;500;700&display=swap' },
      { rel: 'manifest', href: '/manifest.json' }
    );

    const globalSchema = getGlobalSchema();
    const section = cleanPath === '/' ? 'home'
      : cleanPath.startsWith('/blog') ? 'blog'
      : cleanPath.startsWith('/glossary') ? 'glossary'
      : cleanPath.startsWith('/services') ? 'services'
      : 'default';
    const imageUrl = section === 'default' 
      ? `${SITE_URL}/og/default.jpg` 
      : `${SITE_URL}/og/${section}-${currentLocale}.jpg`;
    const currentUrl = `${SITE_URL}${canonicalPath}`;

    // Default meta tags (will be overridden by child routes)
    return {
      title: 'Pearl Coach',
      links,
      meta: [
        { charSet: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'theme-color', content: '#1a2e26' },
        
        // Social / Open Graph Defaults
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Pearl Coach' },
        { property: 'og:image', content: imageUrl },
        { property: 'og:url', content: currentUrl },
        
        // Twitter Defaults
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: imageUrl }
      ],
      scripts: [
        { type: 'application/ld+json', children: JSON.stringify(globalSchema) }
      ]
    };
  },
});

function RootComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(true);
  
  // Use context to get head assets injected from server
  const routerContext = Route.useRouteContext();

  // Manual Title Resolution
  // Workaround for HeadContent not rendering title correctly in SSR (Verified: HeadContent alone results in undefined titles)
  const router = useRouter();
  const matches = useMatches();

  if (typeof window === 'undefined') {
    // console.log('[RootComponent SSR] isI18nReady:', isI18nReady);
  }

  // This state is used to force a re-render when the language changes
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const location = useLocation();

  const appContextValue = useMemo<AppContextType>(() => ({
    isModalOpen,
    setIsModalOpen,
    isChatOpen,
    setIsChatOpen
  }), [isModalOpen, isChatOpen]);

  // Initialize i18n
  useEffect(() => {
    const init = async () => {
      // Only run init if not already initialized
      // @ts-expect-error -- Global window property
      if (typeof window !== 'undefined' && !window.__I18N_INITIALIZED__) {
         await initI18n();
         // @ts-expect-error -- Global window property
         window.__I18N_INITIALIZED__ = true;
      }
      setIsI18nReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    // Delay FAB appearance for a better initial page load experience
    const timer = setTimeout(() => setShowFab(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Subscribe to i18n changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate();
    });
    return () => unsubscribe();
  }, []);
  
  // Initialize Cal.com globally once with 'hit' namespace
  useEffect(() => {
    if (document.getElementById('cal-embed-script')) return;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function (...args: any[]) {
        const cal = C.Cal;
        const ar = args;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const sc = d.createElement("script");
          sc.id = 'cal-embed-script';
          sc.src = A;
          sc.async = true;
          sc.crossOrigin = "anonymous";
          d.head.appendChild(sc);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function (...args: any[]) { p(api, args); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = (window as any).Cal;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    
    if (Cal) {
      Cal("init", "hit", { origin: "https://app.cal.com" });
      Cal.ns.hit("ui", {
        "styles": { "branding": { "brandColor": "#c9a86b" } },
        "hideEventTypeDetails": false,
        "theme": "dark",
        "layout": "month_view"
      });
    }
  }, []);

  const currentLocale = getLocale();
  
  // Show loading state while i18n initializes
  // On server, isI18nReady is true by default, so we skip this.
  // On client, if it's false, we show spinner.
  if (!isI18nReady && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen bg-[#2c3e34] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a86b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Check if title is already provided in context or head assets
  let title: string | undefined = routerContext.title;
  
  if (!title && routerContext.head) {
     const match = routerContext.head.match(/<title>(.*?)<\/title>/);
     if (match) title = match[1];
   }

   if (title) {
       console.log('[SSR] Title found in context/head, skipping workaround.');
   }
   
   if (!title) {
     console.log('[SSR] Title not found in context, entering workaround resolution.');
     try {
      for (const match of matches) {
        // 1. Try to get title from head function
        const route = router.routesById[match.routeId];
        if (route?.options?.head) {
          try {
            // Construct a partial context for the head function
            const ctx: any = {
              ...match,
              matches,
              router,
              location: router.state.location,
            };
            const res = route.options.head(ctx);
            // @ts-expect-error -- Head option result check
            if (res?.title) {
              // @ts-expect-error -- Head option result check
              title = res.title;
            }
          } catch (e) {
            console.warn(`[SSR] Error executing head for ${match.routeId}:`, e);
          }
        }
        
        // 2. Fallback: Check for SEO data in loaderData (common pattern in this app)
        // This is useful if the head function just returns loaderData.seo and we failed to execute it or something
        if ((match.loaderData as any)?.seo?.title) {
          title = (match.loaderData as any).seo.title;
        }
      }
    } catch (e) {
      console.error('Error computing title:', e);
    }
  }

  if (!title) {
      console.warn('[SSR] Title is undefined after resolution, using fallback.');
      title = 'Pearl Coach';
  } else {
      const maybeKey = typeof title === 'string' && title.includes('.') && /^[a-zA-Z0-9_.-]+$/.test(title);
      if (maybeKey) {
        const translated = t(title);
        if (translated && translated !== title) {
          title = translated as string;
        }
      }
      console.log(`[SSR] Resolved Title: ${title}`);
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <html lang={currentLocale} className="scroll-smooth">
        <head>
          <title>{title}</title>
          <HeadContent />
        </head>
        <body className="text-[#f0f0e6]">
          <div className="flex flex-col min-h-screen font-inter bg-[#1a2e26] text-[#f0f0e6] relative overflow-hidden">
            {/* ... Background elements ... */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#c9a86b]/10 to-transparent opacity-50"></div>
              <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#c9a86b]/5 blur-[100px]"></div>
              <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#c9a86b]/5 blur-[80px]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              
              <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                 <Outlet />
              </main>

              <Footer locale={currentLocale} />
            </div>

            {/* Modals and Overlays */}
            <EmailModal />
            
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
               {/* FAB and Chatbot logic */}
               {showFab && !isChatOpen && (
                 <button
                   onClick={() => setIsChatOpen(true)}
                   className="w-14 h-14 bg-[#c9a86b] hover:bg-[#b08d55] text-[#1a2e26] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                   aria-label={t('components.chatbot.open_assistant_aria')}
                 >
                   <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
                 </button>
               )}
            </div>

            {isChatOpen && (
              <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right">
                <Chatbot />
              </div>
            )}
            
            <CookieConsentBanner />
            <LanguageSwitchBanner />
            <div id="portal-root" />
          </div>
          <Scripts />
        </body>
      </html>
    </AppContext.Provider>
  );
}




import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Section } from '../../components/ui';
import { getSeoOptions, getMetaFromI18n } from '../../utils/seo';
import { t, getStructuredData, getTranslationsForLocale, DEFAULT_LOCALE, Locale } from '../../i18n';
import { SITE_URL } from '../../siteConfig';
import ReactMarkdown from 'react-markdown';
import type { StoryPoint } from '../../types';
import FounderPrelude from '../../components/FounderPrelude';
import { LocaleLink } from '../../components/LocaleLink';

export const Route = createFileRoute('/$locale/about')({
  component: AboutComponent,
  loader: async ({ params }: { params: { locale?: string } }) => {
    const locale = (params.locale as Locale) || DEFAULT_LOCALE;
    const translations = await getTranslationsForLocale(locale);
    
    const metaOptions = getSeoOptions({
      ...getMetaFromI18n('pages.about.meta', translations) as any,
      path: '/about',
    }, locale, translations);

    const chapter1Points = getStructuredData<StoryPoint[]>('pages.about.chapter1.points', translations);
    const chapter2Points = getStructuredData<StoryPoint[]>('pages.about.chapter2.points', translations);

    return {
      seo: {
        title: metaOptions.title,
        meta: metaOptions.meta,
        links: metaOptions.links,
      },
      chapter1Points,
      chapter2Points
    };
  },
  head: ({ loaderData }) => loaderData?.seo || {},
});

function AboutComponent() {
  const { chapter1Points, chapter2Points } = Route.useLoaderData() as {
    chapter1Points: StoryPoint[];
    chapter2Points: StoryPoint[];
  };

  return (
    <>
      <Section id="about-story" className="bg-[#2c3e34]/50">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-playfair-display leading-tight">{t("pages.about.title")}</h1>
            <div className="mt-4 text-lg text-[#c9a86b]"><ReactMarkdown>{t("pages.about.subtitle")}</ReactMarkdown></div>
          </header>

          <FounderPrelude />

          <article className="prose prose-invert prose-lg mx-auto text-[#f0f0e6]/80 space-y-20">
            
            <section>
              <h2 className="font-playfair-display text-3xl text-[#c9a86b] border-b border-[#c9a86b]/20 pb-4 italic">{t("pages.about.chapter1.title")}</h2>
              <div className="mt-6 text-xl leading-relaxed"><ReactMarkdown>{t("pages.about.chapter1.p1")}</ReactMarkdown></div>
                <ul className="list-none !pl-0 space-y-8 mt-10">
                  {chapter1Points.map(point => (
                    <li key={point.title} className="p-8 rounded-2xl bg-[#2c3e34]/40 border border-[#f0f0e6]/10 shadow-inner">
                      <strong className="text-[#c9a86b] block mb-3 text-xl font-playfair-display">{point.title}</strong>
                      <div className="text-[#f0f0e6]/90 leading-loose"><ReactMarkdown>{point.content}</ReactMarkdown></div>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 italic text-[#f0f0e6]/50 text-center"><ReactMarkdown>{`"${t("pages.about.chapter1.p2")}"`}</ReactMarkdown></div>
            </section>

            <section>
              <h2 className="font-playfair-display text-3xl text-[#c9a86b] border-b border-[#c9a86b]/20 pb-4 italic">{t("pages.about.chapter2.title")}</h2>
              <div className="mt-6"><ReactMarkdown>{t("pages.about.chapter2.p1")}</ReactMarkdown></div>
                <ul className="list-none !pl-0 space-y-6 mt-8">
                  {chapter2Points.map(point => (
                    <li key={point.title} className="flex items-start gap-x-5">
                      <span className="text-[#c9a86b] font-bold text-2xl leading-none mt-1">✦</span>
                      <div>
                        <strong className="text-white text-lg">{point.title}</strong>
                        <div className="text-[#f0f0e6]/70 text-base mt-2 leading-relaxed"><ReactMarkdown>{point.content}</ReactMarkdown></div>
                      </div>
                    </li>
                  ))}
                </ul>
              <div className="mt-10 border-l-4 border-[#c9a86b]/30 pl-8 text-[#f0f0e6]/90 italic"><ReactMarkdown>{t("pages.about.chapter2.p2")}</ReactMarkdown></div>
            </section>
            
            <section>
              <h2 className="font-playfair-display text-3xl text-[#c9a86b] border-b border-[#c9a86b]/20 pb-4 italic">{t("pages.about.chapter3.title")}</h2>
              <div className="space-y-6 mt-8 leading-loose">
                <ReactMarkdown>{t('pages.about.chapter3.p1')}</ReactMarkdown>
                <ReactMarkdown>{t('pages.about.chapter3.p2')}</ReactMarkdown>
              </div>
              <blockquote className="border-l-4 border-[#c9a86b] pl-8 italic text-[#f0f0e6] bg-[#c9a86b]/5 py-10 rounded-r-2xl shadow-xl mt-12">
                  <div className="text-xl leading-relaxed m-0 font-bold"><ReactMarkdown>{t("pages.about.chapter3.quote")}</ReactMarkdown></div>
              </blockquote>
            </section>
            
             <section>
                <div className="border-2 border-[#c9a86b]/20 py-12 px-10 my-16 text-center bg-gradient-to-b from-[#2c3e34]/60 to-transparent rounded-3xl shadow-2xl">
                    <div className="text-3xl font-playfair-display text-white mb-6"><ReactMarkdown>{t("pages.about.interlude.p1")}</ReactMarkdown></div>
                    <div className="text-[#c9a86b] font-bold tracking-[0.2em] uppercase text-sm"><ReactMarkdown>{t("pages.about.interlude.p2")}</ReactMarkdown></div>
                </div>
            </section>

            <section>
              <h2 className="font-playfair-display text-3xl text-[#c9a86b] border-b border-[#c9a86b]/20 pb-4 italic">{t("pages.about.chapter4.title")}</h2>
              <div className="space-y-6 mt-8">
                <ReactMarkdown>{t('pages.about.chapter4.p1')}</ReactMarkdown>
                <ReactMarkdown>{t('pages.about.chapter4.p2')}</ReactMarkdown>
              </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                    <LocaleLink to="/blog/my-first-bug-report" className="group p-6 rounded-xl bg-[#556b5b]/20 border border-[#c9a86b]/30 text-[#c9a86b] hover:bg-[#c9a86b] hover:text-[#2c3e34] transition-all duration-300 text-center font-bold shadow-lg">
                        <span className="block text-xs uppercase tracking-widest mb-1 opacity-60">{t("pages.about.chapter4.label_log_entry")}</span>
                        {t('pages.about.chapter4.links.0')}
                    </LocaleLink>
                    <LocaleLink to="/blog/energy-cold-start-protocol" className="group p-6 rounded-xl bg-[#556b5b]/20 border border-[#c9a86b]/30 text-[#c9a86b] hover:bg-[#c9a86b] hover:text-[#2c3e34] transition-all duration-300 text-center font-bold shadow-lg">
                        <span className="block text-xs uppercase tracking-widest mb-1 opacity-60">{t("pages.about.chapter4.label_protocol")}</span>
                        {t('pages.about.chapter4.links.1')}
                    </LocaleLink>
                </div>
              <p className="mt-16 text-center text-[#f0f0e6]/40 text-sm italic tracking-wide">{t("pages.about.chapter4.p3")}</p>
            </section>
            
          </article>
        </div>
      </Section>
    </>
  );
}
import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory } from '@tanstack/react-router'
import { RouterServer } from '@tanstack/react-router/ssr/server'
import { createRouter } from './router'
import { initI18n } from './i18n'

export async function render(url: string, head?: string) {
  // Normalize incoming URL to pathname + search for router/history
  const parsed = url.startsWith('http')
    ? new URL(url)
    : new URL(url, 'http://localhost')
  const initialHref = `${parsed.pathname}${parsed.search}${parsed.hash || ''}`

  // 1. Initialize i18n using pathname
  await initI18n(parsed.pathname)

  // 2. Create Router
  const history = createMemoryHistory({
    initialEntries: [initialHref],
  })
  const router = createRouter({ history })
  
  // 3. Inject server context (like head tags from Vite)
  // This passes the Vite-generated scripts/styles to the router context
  // which can be accessed in __root.tsx via Route.useRouteContext().head
  // However, TanStack Router usually expects this to be handled via `Scripts` or similar.
  // In our __root.tsx we are not yet using ctx.head explicitly for assets, 
  // BUT the `RouterServer` component along with `Start` (if we were using Start) would handle it.
  // Since we are using vanilla TanStack Router + Vite, we need to ensure the assets are rendered.
  // The `head` argument passed here contains <script> tags for the entry point.
  // We can pass it to context, but we also need to render it.
  
  router.update({
    context: {
      ...router.options.context,
      head: head || '',
      location: router.state.location,
    },
  })

  // 4. Load data
  await router.load()

  console.log('[SSR Debug] Location:', router.state.location.href);
  console.log('[SSR Debug] Router Matches Length:', router.state.matches.length);
  console.log('[SSR Debug] Router Matches IDs:', router.state.matches.map(m => m.routeId));

  // console.log('SSR Router State:');
  // console.log('  Location:', router.state.location.pathname);
  // console.log('  Matches:', router.state.matches.map(m => m.routeId));

  // Check if About route has head
  /*
  const aboutRoute = router.routesByPath['/about'] || Object.values(router.routesById).find(r => r.id.includes('about'));
  if (aboutRoute) {
    console.log('About Route Found:', aboutRoute.id);
    console.log('About Route Head Defined:', !!aboutRoute.options.head);
  } else {
    console.log('About Route NOT Found in routesById');
    console.log('Routes:', Object.keys(router.routesById));
  }
  */

  // 5. Render app (Full SSR)
  let appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <RouterServer router={router} />
    </React.StrictMode>
  )

  // Inject head assets (scripts/styles) into the rendered HTML
  // We look for </head> and insert the assets before it
  if (head) {
    appHtml = appHtml.replace('</head>', `${head}\n</head>`)
  }

  // Remove any dev-time asset references like /src/* (e.g., /src/index.css)
  appHtml = appHtml
    .replace(/<link[^>]+href="\/src\/[^"]+"[^>]*>/g, '')
    .replace(/<script[^>]+src="\/src\/[^"]+"[^>]*><\/script>/g, '');

  // 6. Dehydrate
  const dehydratedRouter = {
    state: router.state,
  }

  // Return structure compatible with what consumers expect
  // appHtml is now the FULL html document.
  return { appHtml, dehydratedRouter, headHtml: '' }
}
