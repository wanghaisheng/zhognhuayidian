import { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { normalizePathname } from '../utils/url';

/**
 * Trailing Slash Normalization Component
 * 
 * This component ensures all URLs follow a consistent format (without trailing slashes)
 * to prevent duplicate content issues for SEO.
 * 
 * Rules:
 * 1. Remove trailing slashes from all URLs (except root "/")
 * 2. Normalize multiple slashes to single slashes
 * 3. Preserve query parameters and hash fragments
 * 
 * Examples:
 * - /devices/ → /devices
 * - /manufacturers// → /manufacturers
 * - /compare/ct-scanners/ → /compare/ct-scanners
 * - / → / (unchanged - root path)
 */

interface TrailingSlashRedirectProps {
  children: React.ReactNode;
}

export const TrailingSlashRedirect: React.FC<TrailingSlashRedirectProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search } = location;
    const normalizedPathname = normalizePathname(pathname);
    
    // If the pathname needs normalization, redirect
    if (pathname !== normalizedPathname) {
      navigate({ to: `${normalizedPathname}${search}`, replace: true });
    }
  }, [location, navigate]);

  return <>{children}</>;
};

export default TrailingSlashRedirect;
