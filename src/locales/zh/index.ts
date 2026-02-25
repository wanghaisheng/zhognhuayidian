// Chinese translations aggregation
import { common } from './labels/common';
import { header } from './labels/navigation/header';
import { home } from './labels/pages/home';
import { about } from './labels/pages/about';
import { faq } from './labels/pages/faq';
import { privacy } from './labels/pages/privacy';
import { glossary } from './labels/pages/glossary';
import { tags } from './labels/pages/tags';
import { terms } from './labels/pages/terms';
import { bookDetail } from './labels/pages/book-detail';
import { book } from './book'; // 临时兼容文件
import { organisms } from './labels/components/organisms';
import { molecules } from './labels/components/molecules';
import { templates } from './labels/components/templates';
import { examples } from './labels/components/examples';
import { dataValidator } from './labels/dataValidator';
import { seo as seoLabels } from './labels/seo';
import { footer } from './labels/navigation/footer';
import { stats as statsData } from './labels/data/stats';

export const zhTranslations = {
  common,
  header,
  home,
  about,
  faq,
  privacy,
  glossary,
  tags,
  terms,
  bookDetail,
  book, // 临时兼容
  organisms,
  molecules,
  templates,
  examples,
  dataValidator,
  seo: seoLabels,
  footer,
  stats: statsData
};
