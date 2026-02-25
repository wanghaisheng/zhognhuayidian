// 古籍相关类型定义

export type LanguageCode = 'zh' | 'en';

export type BookCategory = 
  | 'medical-classics'
  | 'materia-medica'
  | 'prescriptions'
  | 'acupuncture'
  | 'diagnostics';

export interface BookMetadata {
  dynasty: string;
  author: string;
  chapters: number;
  wordCount: number;
  publishYear?: string;
  tags: string[];
  coverImage?: string;
}

export interface Concept {
  id: string;
  term: string;
  description: string;
  category: string;
  relatedConcepts: string[];
}

export interface Section {
  id: string;
  title: string;
  order: number;
  originalText: string;
  translation: string;
  interpretation: string;
  keyConcepts: Concept[];
}

export interface Chapter {
  readonly id: string;
  readonly title: Record<LanguageCode, string>;
  readonly order: number;
  readonly sections: ReadonlyArray<Section>;
  readonly keyConcepts: ReadonlyArray<Concept>;
  readonly summary?: string;
}

export interface AncientBook {
  readonly id: string;
  readonly title: Record<LanguageCode, string>;
  readonly dynasty: string;
  readonly author: string;
  readonly category: BookCategory;
  readonly chapters: ReadonlyArray<Chapter>;
  readonly metadata: BookMetadata;
  readonly translations: Readonly<Record<LanguageCode, DeepPartial<AncientBook>>>;
  readonly relatedBooks: ReadonlyArray<string>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UserBookmark {
  readonly id: string;
  readonly bookId: string;
  readonly chapterId: string;
  readonly sectionId: string;
  readonly position: number;
  readonly note?: string;
  readonly createdAt: Date;
}

export interface UserNote {
  readonly id: string;
  readonly bookId: string;
  readonly chapterId: string;
  readonly sectionId: string;
  readonly content: string;
  readonly range: TextRange;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TextRange {
  readonly start: number;
  readonly end: number;
  readonly text: string;
}

export interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';
  showAnnotations: boolean;
  autoSave: boolean;
  readingMode: 'original' | 'translation' | 'interpretation';
}

export interface ReadingContext {
  currentBook: AncientBook | null;
  currentChapter: Chapter | null;
  readingMode: 'original' | 'translation' | 'interpretation';
  bookmarks: UserBookmark[];
  notes: UserNote[];
  settings: ReadingSettings;
  progress: Record<string, number>; // bookId -> progress
}

// API 响应类型
export interface BookListResponse {
  books: AncientBook[];
  total: number;
  categories: Record<BookCategory, number>;
}

export interface BookDetailResponse {
  book: AncientBook;
  relatedBooks: AncientBook[];
  readingProgress?: number;
}

export interface ChapterResponse {
  chapter: Chapter;
  nextChapter?: Chapter;
  prevChapter?: Chapter;
}

// 搜索相关类型
export interface BookSearchQuery {
  query: string;
  category?: BookCategory;
  dynasty?: string;
  author?: string;
  limit?: number;
  offset?: number;
}

export interface BookSearchResult {
  books: AncientBook[];
  total: number;
  suggestions?: string[];
}

// 错误类型
export interface BookError {
  code: string;
  message: string;
  details?: unknown;
}

// 工具类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type UseQueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: BookError | null;
  refetch: () => void;
};

// 组件 Props 类型
export interface BookTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onChapterChange: (chapterId: string) => void;
  className?: string;
}

export interface ContentTabsProps {
  originalText: string;
  translation: string;
  interpretation: string;
  activeTab: 'original' | 'translation' | 'interpretation';
  onTabChange: (tab: 'original' | 'translation' | 'interpretation') => void;
  className?: string;
}

export interface ReadingProgressProps {
  progress: number;
  total: number;
  className?: string;
}

// 常量
export const BOOK_CATEGORIES = {
  MEDICAL_CLASSICS: 'medical-classics',
  MATERIA_MEDICA: 'materia-medica',
  PRESCRIPTIONS: 'prescriptions',
  ACUPUNCTURE: 'acupuncture',
  DIAGNOSTICS: 'diagnostics'
} as const;

export const READING_MODES = {
  ORIGINAL: 'original',
  TRANSLATION: 'translation',
  INTERPRETATION: 'interpretation'
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SEPIA: 'sepia'
} as const;
