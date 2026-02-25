export const normalizePathname = (pathname: string): string => {
  // Step 1: Remove multiple consecutive slashes
  let normalized = pathname.replace(/\/+/g, '/');
  
  // Step 2: Remove trailing slash (except for root path)
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  
  return normalized || '/';
};
