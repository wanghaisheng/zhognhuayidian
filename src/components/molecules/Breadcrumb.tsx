import React from 'react';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from '@/utils/urlStructure';
import LangLink from '@/components/molecules/LangLink';

export interface BreadcrumbItemType {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItemType[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const location = useLocation();
  const { i18n } = useTranslation();

  const breadcrumbs = items || generateBreadcrumbs(location.pathname, i18n.language);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <BreadcrumbRoot className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return [
            <BreadcrumbItem key={breadcrumb.href}>
              {isLast ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <LangLink to={breadcrumb.href}>{breadcrumb.label}</LangLink>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>,
            !isLast && <BreadcrumbSeparator key={`${breadcrumb.href}-sep`} />
          ];
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
};

export default Breadcrumb;
