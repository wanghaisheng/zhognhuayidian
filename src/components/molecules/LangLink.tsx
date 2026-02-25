import React from 'react';
import { Link } from '@tanstack/react-router';
import { useLanguageRoutes } from '@/hooks/useLanguageRoutes';
import { removeLanguagePrefix, addLanguagePrefix } from '@/utils/multilingualRoutes';

type BaseLinkProps = React.ComponentProps<typeof Link>;

interface LangLinkProps extends Omit<BaseLinkProps, 'to' | 'params'> {
  to: string;
  params?: Record<string, unknown>;
}

const LangLink: React.FC<LangLinkProps> = ({ to, children, ...rest }) => {
  const { currentLanguage } = useLanguageRoutes();
  const normalizedTo = addLanguagePrefix(removeLanguagePrefix(to), currentLanguage);
  return (
    <Link 
      to={normalizedTo as BaseLinkProps['to']} 
      {...rest} 
      params={rest.params as unknown as BaseLinkProps['params']}
    >
      {children}
    </Link>
  );
};

export default LangLink;
