
/**
 * Helper type for deep recursive partial objects
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export interface Tag {
  id: string;
  name: string;
  category: 'country' | 'specialty' | 'technology' | 'market_position' | 'certification' | 'product_type';
  count: number;
  description: string;
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<Tag>>;
}
