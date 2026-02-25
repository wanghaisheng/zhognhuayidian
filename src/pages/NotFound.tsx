import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { addLanguagePrefix } from "@/utils/multilingualRoutes";
import { SupportedLanguage } from "@/config/language";

const NotFound = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">{t('common.pageNotFoundDescription')}</p>
        <Link to={addLanguagePrefix('/', i18n.language as SupportedLanguage)} className="text-info hover:text-info/80 underline">
          {t('common.returnHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
