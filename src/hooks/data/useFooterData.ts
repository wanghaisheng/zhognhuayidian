
import { useTranslation } from 'react-i18next';
import { FOOTER_SECTIONS, FooterSectionKey } from '@/config/constants';

export const useFooterData = () => {
  const { t, i18n } = useTranslation();

  const getSectionLinks = (sectionKey: FooterSectionKey) => {
    return FOOTER_SECTIONS[sectionKey].map((item) => {
      const title = t(`data.footer.${sectionKey}.${item.key}`);
      // 统一将动态设备分类链接改为 token 路径+params
      if (item.path === '/devices/ct-scanners') {
        return { title, href: '/devices/$category', params: { category: 'ct-scanners' } };
      }
      if (item.path === '/devices/mri-scanners') {
        return { title, href: '/devices/$category', params: { category: 'mri-scanners' } };
      }
      // 其他保持原始字符串（静态页面或带查询参数）
      return { title, href: item.path };
    });
  };

  return {
    deviceLinks: getSectionLinks('devices'),
    manufacturerLinks: getSectionLinks('manufacturers'),
    resourceLinks: getSectionLinks('resources'),
    marketLinks: getSectionLinks('market'),
    companyLinks: getSectionLinks('company'),
  };
};
