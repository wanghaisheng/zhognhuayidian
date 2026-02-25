
import { useTranslation } from 'react-i18next';
//但这里应该是多语言支持啊 为啥硬编码读取en
// 应该根据当前语言动态读取对应的导航项

import { NAVIGATION_ITEMS } from '@/config/constants';
import { Monitor, TrendingUp, BookOpen, Award, Building, DollarSign, Scale, GraduationCap } from "lucide-react";
import { addLanguagePrefix } from '@/utils/multilingualRoutes';
import { SupportedLanguage } from '@/config/language';

const ICON_MAP = {
  devices: Monitor,
  manufacturers: Building,
  pricing: DollarSign,
  compare: Scale,
  learn: GraduationCap,
  resources: BookOpen,
  analysis: TrendingUp,
  about: Award
};

export const useNavigationData = () => {
  const { t, i18n } = useTranslation();

  const navItems = NAVIGATION_ITEMS.map((item) => ({
    ...item,
    label: t(`header.${item.key}`),
    icon: ICON_MAP[item.key],
    path: addLanguagePrefix(item.path, i18n.language as SupportedLanguage)
  }));

  return { navItems };
};
