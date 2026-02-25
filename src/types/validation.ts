
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  statistics: {
    totalManufacturers: number;
    totalDevices: number;
    totalMRIDevices: number;
    chineseManufacturers: number;
    globalManufacturers: number;
    highEndDevices: number;
    midRangeDevices: number;
    entryLevelDevices: number;
  };
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<ValidationResult>>;
}

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
