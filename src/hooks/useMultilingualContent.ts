/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguageRoutes } from './useLanguageRoutes';

/**
 * Hook to get multilingual field value based on current language
 * @param zh - Chinese value
 * @param en - English value
 * @returns The value in current language
 */
export function useMultilingualContent<T = string>(
  zh: T | undefined | null,
  en: T | undefined | null
): T | undefined {
  const { currentLanguage } = useLanguageRoutes();
  
  if (currentLanguage === 'zh') {
    return zh || en || undefined;
  }
  
  return en || zh || undefined;
}

/**
 * Hook to get multilingual object with language-specific fields
 * Transforms _zh/_en suffixed fields into single fields based on current language
 * 
 * Example:
28→ * Input: { name_zh: "Name (ZH)", name_en: "Name", type: "CT" }
29→ * Output (zh): { name: "Name (ZH)", type: "CT" }
 * Output (en): { name: "Name", type: "CT" }
 */
export function useMultilingualObject<T extends Record<string, unknown>>(
  obj: T | null | undefined
): Partial<T> {
  const { currentLanguage } = useLanguageRoutes();
  
  if (!obj) return {};
  
  const result: Record<string, unknown> = {};
  
  // 1. Handle translations object (Priority)
  if ((obj as any).translations) {
    const translations = (obj as any).translations;
    const langCode = currentLanguage === 'zh' ? 'zh' : 'en';
    const localizedData = translations[langCode];
    
    if (localizedData) {
      Object.assign(result, localizedData);
    }
  }

  // 2. Process each field in the object (Legacy suffix support)
  Object.keys(obj).forEach((key) => {
    // Skip translations field as we handled it
    if (key === 'translations') return;

    if (key.endsWith('_zh') || key.endsWith('_en')) {
      const baseKey = key.replace(/_zh$|_en$/, '');
      const zhKey = `${baseKey}_zh`;
      const enKey = `${baseKey}_en`;
      
      // Only set if not already set (by translations object)
      if (!result[baseKey]) {
        if (currentLanguage === 'zh') {
          result[baseKey] = obj[zhKey] || obj[enKey];
        } else {
          result[baseKey] = obj[enKey] || obj[zhKey];
        }
      }
    } else {
      // Copy non-multilingual fields as-is, but don't overwrite if translations already set it
      // (e.g. if obj has 'name' and translations has 'name', translations should win? 
      // Actually usually obj 'name' is the default/English one, so translations should win)
      if (!result[key]) {
        result[key] = obj[key];
      }
    }
  });
  
  return result as Partial<T>;
}

/**
 * Get field name with language suffix
 */
export function getMultilingualField(baseField: string, language: 'zh' | 'en'): string {
  return `${baseField}_${language}`;
}
