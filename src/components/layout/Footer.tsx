import React from 'react';
import LangLink from '@/components/molecules/LangLink';
import { Mail, Phone, MapPin, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSiteName } from '@/config/site';
import { LanguageSelectorModal } from '@/components/molecules/LanguageSelectorModal';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'zh';
  const siteName = getSiteName(currentLang);

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* 品牌信息 */}
          <div className="lg:col-span-1">
            <LangLink to="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">{siteName}</span>
            </LangLink>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              {t('header.description')}
            </p>
            
            {/* Language Selector */}
            <div className="mb-8">
              <LanguageSelectorModal 
                trigger={
                  <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all border border-slate-800 bg-slate-900/50 rounded-full px-4 py-2 hover:border-slate-600 hover:bg-slate-900">
                    <span>{currentLang === 'zh' ? '中文' : 'English'}</span>
                  </button>
                }
              />
            </div>
            
            {/* 联系信息 */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors">
                <Mail className="w-4 h-4" />
                <span>{t('footer.email')}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors">
                <Phone className="w-4 h-4" />
                <span>{t('footer.phone')}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors">
                <MapPin className="w-4 h-4" />
                <span>{t('footer.address')}</span>
              </div>
            </div>
          </div>

          {/* 古籍库 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-slate-100">{t('header.library')}</h3>
            <ul className="space-y-3">
              <li>
                <LangLink to="/library" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.library.allBooks')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/library?category=medical-classics" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.library.medicalClassics')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/library?category=materia-medica" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.library.materiaMedica')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/library?category=prescriptions" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.library.prescriptions')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/library?category=acupuncture" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.library.acupuncture')}
                </LangLink>
              </li>
            </ul>
          </div>

          {/* 学术研究 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-slate-100">{t('header.research')}</h3>
            <ul className="space-y-3">
              <li>
                <LangLink to="/research" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.research.researchPapers')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/research?type=institutions" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.research.researchInstitutions')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/research?type=trends" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.research.researchTrends')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/research?category=data-mining" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.research.dataMining')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/research?category=modern-pharmacology" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.research.modernPharmacology')}
                </LangLink>
              </li>
            </ul>
          </div>

          {/* 智能检索 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-slate-100">{t('header.search')}</h3>
            <ul className="space-y-3">
              <li>
                <LangLink to="/search" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.search.fullSearch')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/search?type=books" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.search.bookSearch')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/search?type=prescriptions" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.search.prescriptionSearch')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/search?type=symptoms" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.search.symptomSearch')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/search?type=herbs" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.search.herbSearch')}
                </LangLink>
              </li>
            </ul>
          </div>

          {/* 关于我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-slate-100">{t('header.about')}</h3>
            <ul className="space-y-3">
              <li>
                <LangLink to="/about" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.about.projectIntro')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/about/team" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.about.teamIntro')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/about/mission" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.about.missionVision')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/contact" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.about.contact')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/privacy" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.about.privacy')}
                </LangLink>
              </li>
            </ul>
          </div>

          {/* 资源中心 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-slate-100">{t('header.resources')}</h3>
            <ul className="space-y-3">
              <li>
                <LangLink to="/resources" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.resources.learningGuides')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/resources/tutorials" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.resources.tutorials')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/resources/faq" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.resources.faq')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/resources/api" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.resources.apiDocs')}
                </LangLink>
              </li>
              <li>
                <LangLink to="/resources/blog" className="text-slate-400 hover:text-primary transition-colors text-sm">
                  {t('footer.resources.blog')}
                </LangLink>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2026 {siteName}. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <LangLink to="/privacy" className="hover:text-slate-300 transition-colors">
              {t('footer.about.privacy')}
            </LangLink>
            <LangLink to="/terms" className="hover:text-slate-300 transition-colors">
              {t('pages.terms.title')}
            </LangLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
