export const CATEGORY_FOLDER_ALIAS: Record<string, string> = {
  analysis: 'reports',
  pricing: 'education',
};

export const toFolderCategory = (canonical: string): string => {
  return CATEGORY_FOLDER_ALIAS[canonical] ?? canonical;
};
