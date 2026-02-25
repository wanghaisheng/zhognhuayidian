// 古籍数据管理钩子

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type { 
  AncientBook, 
  Chapter, 
  BookListResponse, 
  BookSearchQuery, 
  BookSearchResult,
  UseQueryResult,
  BookError,
  LanguageCode
} from '@/types/book';

// API 函数
const fetchBook = async (bookId: string, locale?: string): Promise<AncientBook> => {
  console.log('📚 Loading book data from snapshots:', bookId);
  
  // 直接使用项目标准的静态文件加载模式 - import.meta.glob
  const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
  const targetLocale = locale || 'zh'; // 默认使用中文
  
  // 处理bookId映射：suwen -> huangdi-neijing
  const actualBookId = bookId === 'suwen' ? 'huangdi-neijing' : bookId;
  
  const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/${actualBookId}.json`;
  const fallbackPath = `/src/data/snapshots/en/content/ancient-books/${actualBookId}.json`;
  
  console.log('Available snapshot paths:', Object.keys(snapshotMap));
  console.log('Attempting to load snapshot from:', snapshotPath);
  console.log('Fallback path:', fallbackPath);
  
  const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
  
  if (loader) {
    console.log('Found loader, loading data...');
    const mod = await loader();
    const data = (mod as any).default || mod;
    console.log('Loaded data:', data);
    
    // 检查数据结构，适配不同的快照格式
    if (data && typeof data === 'object') {
      // 如果是标准的 content 格式
      if ('content' in data) {
        console.log('Using content format');
        return data.content as AncientBook;
      }
      // 如果直接是书籍数据
      if ('id' in data && 'title' in data) {
        console.log('Using direct book format');
        return data as AncientBook;
      }
    }
    console.log('Data format not recognized, using fallback');
  } else {
    console.log('No loader found for paths, using fallback data');
  }
  
  // 3. 最后回退到硬编码数据
  const fallbackData: AncientBook = {
    id: actualBookId,
    title: {
      zh: '黄帝内经',
      en: 'Yellow Emperor\'s Inner Canon'
    },
    dynasty: targetLocale === 'zh' ? '先秦' : 'Pre-Qin',
    author: targetLocale === 'zh' ? '佚名' : 'Anonymous',
    category: 'medical-classics',
    translations: {
      zh: {
        title: '黄帝内经',
        description: '中医理论奠基之作'
      },
      en: {
        title: 'Yellow Emperor\'s Inner Canon',
        description: 'The foundational classic of Chinese medicine'
      }
    },
    metadata: {
      dynasty: targetLocale === 'zh' ? '先秦' : 'Pre-Qin',
      author: targetLocale === 'zh' ? '佚名' : 'Anonymous',
      chapters: 18,
      wordCount: 25000,
      publishYear: '-2000',
      tags: targetLocale === 'zh' ? ['医经', '基础理论', '黄帝', '阴阳', '五行'] : ['Medical Classic', 'Basic Theory', 'Yellow Emperor', 'Yin-Yang', 'Five Elements'],
      coverImage: '/images/books/huangdi-neijing-cover.jpg'
    },
    chapters: [],
    relatedBooks: ['shanghan-zabing-lun', 'jinkui-yaolue', 'bencao-gangmu', 'nan-jing'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  };
  
  return fallbackData;
};

const fetchChapter = async (bookId: string, chapterId: string): Promise<Chapter> => {
  console.log('📖 Loading chapter data from snapshots:', bookId, chapterId);
  
  // 直接使用项目标准的静态文件加载模式 - import.meta.glob
  const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*/chapters/*.json', { eager: false });
  const targetLocale = 'zh'; // 默认使用中文
  
  // 处理bookId映射：suwen -> huangdi-neijing
  const actualBookId = bookId === 'suwen' ? 'huangdi-neijing' : bookId;
  
  const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/${actualBookId}/chapters/${chapterId}.json`;
  const fallbackPath = `/src/data/snapshots/en/content/ancient-books/${actualBookId}/chapters/${chapterId}.json`;
  
  console.log('Available chapter snapshot paths:', Object.keys(snapshotMap));
  console.log('Attempting to load chapter snapshot from:', snapshotPath);
  console.log('Fallback path:', fallbackPath);
  
  const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
  
  if (loader) {
    console.log('Found chapter loader, loading data...');
    const mod = await loader();
    const data = (mod as any).default || mod;
    console.log('Loaded chapter data:', data);
    return data as Chapter;
  } else {
    console.log('No chapter loader found, using fallback chapter data');
    
    // 回退到硬编码章节数据
    const fallbackChapter: Chapter = {
      id: chapterId,
      title: {
        zh: '章节标题',
        en: 'Chapter Title'
      },
      order: 0,
      summary: '章节摘要',
      sections: [
        {
          id: `${chapterId}-1`,
          title: '章节内容',
          order: 0,
          originalText: '原文内容',
          translation: '译文内容',
          interpretation: '解读内容',
          keyConcepts: []
        }
      ],
      keyConcepts: []
    };
    
    return fallbackChapter;
  }
};

const fetchBookList = async (params?: {
  category?: string;
  dynasty?: string;
  limit?: number;
  offset?: number;
}): Promise<BookListResponse> => {
  console.log('📚 Loading book list from snapshots:', params);
  
  // 使用项目标准的静态文件加载模式 - import.meta.glob
  const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
  const targetLocale = 'zh'; // 默认使用中文
  
  const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/collection.json`;
  const fallbackPath = `/src/data/snapshots/en/content/ancient-books/collection.json`;
  
  console.log('Available collection paths:', Object.keys(snapshotMap));
  console.log('Attempting to load collection from:', snapshotPath);
  
  const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
  
  if (loader) {
    console.log('Found collection loader, loading data...');
    const mod = await loader();
    const data = (mod as any).default || mod;
    console.log('Loaded collection data:', data);
    
    // 应用过滤参数
    let books = data.books || [];
    
    if (params?.category) {
      books = books.filter((book: any) => book.category === params.category);
    }
    
    if (params?.dynasty) {
      books = books.filter((book: any) => book.dynasty === params.dynasty);
    }
    
    // 应用分页
    const limit = params?.limit || 10;
    const offset = params?.offset || 0;
    const paginatedBooks = books.slice(offset, offset + limit);
    
    return {
      books: paginatedBooks,
      total: books.length,
      limit,
      offset
    };
  } else {
    console.log('No collection loader found, using fallback data');
    
    // 回退到硬编码数据
    const fallbackBooks: AncientBook[] = [
      {
        id: 'huangdi-neijing',
        title: { zh: '黄帝内经', en: 'Yellow Emperor\'s Inner Canon' },
        dynasty: '先秦',
        author: '佚名',
        category: 'medical-classics',
        translations: {
          zh: { title: '黄帝内经', description: '中医理论奠基之作' },
          en: { title: 'Yellow Emperor\'s Inner Canon', description: 'The foundational classic of Chinese medicine' }
        },
        metadata: {
          dynasty: '先秦',
          author: '佚名',
          chapters: 18,
          wordCount: 25000,
          publishYear: '-2000',
          tags: ['医经', '基础理论'],
          coverImage: '/images/books/huangdi-neijing-cover.jpg'
        },
        chapters: [],
        relatedBooks: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      }
    ];
    
    return {
      books: fallbackBooks.slice(0, params?.limit || 10),
      total: fallbackBooks.length,
      limit: params?.limit || 10,
      offset: params?.offset || 0
    };
  }
};

const searchBooks = async (query: BookSearchQuery): Promise<BookSearchResult> => {
  console.log('🔍 Searching books from snapshots:', query);
  
  // 使用项目标准的静态文件加载模式 - import.meta.glob
  const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
  const targetLocale = 'zh'; // 默认使用中文
  
  const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/collection.json`;
  const fallbackPath = `/src/data/snapshots/en/content/ancient-books/collection.json`;
  
  const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
  
  if (loader) {
    console.log('Found collection loader for search, loading data...');
    const mod = await loader();
    const data = (mod as any).default || mod;
    
    let books = data.books || [];
    
    // 应用搜索过滤
    if (query.query) {
      const searchTerm = query.query.toLowerCase();
      books = books.filter((book: any) => 
        book.title.zh?.toLowerCase().includes(searchTerm) ||
        book.title.en?.toLowerCase().includes(searchTerm) ||
        book.author?.toLowerCase().includes(searchTerm) ||
        book.dynasty?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (query.category) {
      books = books.filter((book: any) => book.category === query.category);
    }
    
    if (query.dynasty) {
      books = books.filter((book: any) => book.dynasty === query.dynasty);
    }
    
    if (query.author) {
      books = books.filter((book: any) => book.author?.toLowerCase().includes(query.author.toLowerCase()));
    }
    
    // 应用分页
    const limit = query.limit || 10;
    const offset = query.offset || 0;
    const paginatedBooks = books.slice(offset, offset + limit);
    
    return {
      books: paginatedBooks,
      total: books.length,
      query: query.query,
      limit,
      offset
    };
  } else {
    console.log('No collection loader found for search, using fallback data');
    
    // 回退到空结果
    return {
      books: [],
      total: 0,
      query: query.query,
      limit: query.limit || 10,
      offset: query.offset || 0
    };
  }
};

// 主要钩子
export const fetchBookData = fetchBook;
export { fetchBook };

export const useBook = (bookId: string): UseQueryResult<AncientBook> => {
  const { i18n } = useTranslation();
  const locale = i18n.language as LanguageCode;
  
  return useQuery({
    queryKey: ['book', bookId, locale],
    queryFn: () => fetchBook(bookId, locale),
    staleTime: 5 * 60 * 1000, // 5分钟
    retry: 1,
    enabled: !!bookId
  });
};

export const useChapter = (bookId: string, chapterId: string): UseQueryResult<Chapter> => {
  const { i18n } = useTranslation();
  const locale = i18n.language as LanguageCode;
  
  return useQuery({
    queryKey: ['chapter', bookId, chapterId, locale],
    queryFn: () => fetchChapter(bookId, chapterId),
    staleTime: 5 * 60 * 1000, // 5分钟
    retry: 1,
    enabled: !!bookId && !!chapterId
  });
};

export const useBookList = (params?: {
  category?: string;
  dynasty?: string;
  limit?: number;
  offset?: number;
}): UseQueryResult<BookListResponse> => {
  const { i18n } = useTranslation();
  const locale = i18n.language as LanguageCode;
  
  return useQuery({
    queryKey: ['books', 'list', locale, params],
    queryFn: () => fetchBookList(params),
    staleTime: 2 * 60 * 1000, // 2分钟
    retry: 1
  });
};

export const useBookSearch = (query: BookSearchQuery): UseQueryResult<BookSearchResult> => {
  const { i18n } = useTranslation();
  const locale = i18n.language as LanguageCode;
  
  return useQuery({
    queryKey: ['books', 'search', locale, query],
    queryFn: () => searchBooks(query),
    staleTime: 30 * 1000, // 30秒
    retry: 1,
    enabled: !!query.query && query.query.length > 0
  });
};

// 预加载钩子
export const usePreloadChapter = (bookId: string, chapterId: string) => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const locale = i18n.language as LanguageCode;
  
  return useMemo(() => {
    return () => {
      queryClient.prefetchQuery({
        queryKey: ['chapter', bookId, chapterId, locale],
        queryFn: () => fetchChapter(bookId, chapterId),
        staleTime: 5 * 60 * 1000
      });
    };
  }, [queryClient, bookId, chapterId, locale]);
};

// 批量预加载钩子
export const usePreloadBookChapters = (bookId: string, chapterIds: string[]) => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const locale = i18n.language as LanguageCode;
  
  return useMemo(() => {
    return () => {
      chapterIds.forEach(chapterId => {
        queryClient.prefetchQuery({
          queryKey: ['chapter', bookId, chapterId, locale],
          queryFn: () => fetchChapter(bookId, chapterId),
          staleTime: 5 * 60 * 1000
        });
      });
    };
  }, [queryClient, bookId, chapterIds, locale]);
};

// 相关书籍钩子
export const useRelatedBooks = (bookId: string): UseQueryResult<AncientBook[]> => {
  const { i18n } = useTranslation();
  const locale = i18n.language as LanguageCode;
  
  return useQuery({
    queryKey: ['books', 'related', bookId, locale],
    queryFn: async () => {
      console.log('📚 Loading related books from snapshots:', bookId);
      
      // 使用项目标准的静态文件加载模式 - import.meta.glob
      const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
      const targetLocale = 'zh'; // 默认使用中文
      
      const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/collection.json`;
      const fallbackPath = `/src/data/snapshots/en/content/ancient-books/collection.json`;
      
      const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
      
      if (loader) {
        console.log('Found collection loader for related books, loading data...');
        const mod = await loader();
        const data = (mod as any).default || mod;
        
        // 简单的相关书籍逻辑：同类别或同朝代的书籍
        const allBooks = data.books || [];
        const currentBook = allBooks.find((book: any) => book.id === bookId);
        
        if (currentBook) {
          const relatedBooks = allBooks.filter((book: any) => 
            book.id !== bookId && (
              book.category === currentBook.category ||
              book.dynasty === currentBook.dynasty
            )
          ).slice(0, 5); // 限制为5本相关书籍
          
          return relatedBooks;
        }
      }
      
      console.log('No related books found, returning empty array');
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10分钟
    retry: 1,
    enabled: !!bookId
  });
};

// 本地存储管理器
const createLocalStorageManager = <T>(key: string) => {
  return {
    get: (): T[] => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },
    set: (items: T[]) => {
      try {
        localStorage.setItem(key, JSON.stringify(items));
      } catch (error) {
        console.warn(`Failed to save ${key} to localStorage:`, error);
      }
    },
    add: (item: T) => {
      const items = createLocalStorageManager<T>(key).get();
      items.push(item);
      createLocalStorageManager<T>(key).set(items);
    },
    remove: (id: string) => {
      const items = createLocalStorageManager<T>(key).get();
      const filtered = items.filter((item: any) => item.id !== id);
      createLocalStorageManager<T>(key).set(filtered);
    }
  };
};

// 阅读进度钩子 - 使用本地存储
export const useReadingProgress = (bookId: string) => {
  const queryClient = useQueryClient();
  
  const { data: progress, ...rest } = useQuery({
    queryKey: ['reading-progress', bookId],
    queryFn: async () => {
      console.log('📈 Loading reading progress from localStorage:', bookId);
      
      const progressManager = createLocalStorageManager<any>('reading-progress');
      const progressData = progressManager.get();
      const currentProgress = progressData.find((p: any) => p.bookId === bookId);
      
      return currentProgress || { bookId, progress: 0, lastRead: new Date().toISOString() };
    },
    staleTime: 60 * 1000, // 1分钟
    retry: 1,
    enabled: !!bookId
  });
  
  const updateProgress = useMemo(() => {
    return (newProgress: number) => {
      console.log('📈 Updating reading progress:', bookId, newProgress);
      
      queryClient.mutate({
        mutationFn: async (progress: number) => {
          const progressManager = createLocalStorageManager<any>('reading-progress');
          const progressData = progressManager.get();
          
          // 移除旧的进度记录
          const filtered = progressData.filter((p: any) => p.bookId !== bookId);
          
          // 添加新的进度记录
          const newRecord = {
            bookId,
            progress,
            lastRead: new Date().toISOString()
          };
          
          filtered.push(newRecord);
          progressManager.set(filtered);
          
          return newRecord;
        },
        onSuccess: () => {
          // 重新获取进度数据
          queryClient.invalidateQueries({ queryKey: ['reading-progress', bookId] });
        }
      });
    };
  }, [queryClient, bookId]);
  
  return { data: progress, updateProgress, ...rest };
};

// 书签钩子
export const useBookmarks = (bookId: string) => {
  const queryClient = useQueryClient();
  
  const { data: bookmarks, ...rest } = useQuery({
    queryKey: ['bookmarks', bookId],
    queryFn: async () => {
      console.log('🔖 Loading bookmarks from localStorage:', bookId);
      
      const bookmarkManager = createLocalStorageManager<any>('bookmarks');
      const bookmarkData = bookmarkManager.get();
      const bookBookmarks = bookmarkData.filter((b: any) => b.bookId === bookId);
      
      return bookBookmarks;
    },
    staleTime: 2 * 60 * 1000, // 2分钟
    retry: 1,
    enabled: !!bookId
  });
  
  const addBookmark = useMemo(() => {
    return (bookmarkData: {
      chapterId: string;
      sectionId: string;
      position: number;
      note?: string;
    }) => {
      console.log('🔖 Adding bookmark:', bookId, bookmarkData);
      
      queryClient.mutate({
        mutationFn: async (data: typeof bookmarkData) => {
          const bookmarkManager = createLocalStorageManager<any>('bookmarks');
          
          const newBookmark = {
            id: `bookmark-${Date.now()}`,
            bookId,
            ...data,
            createdAt: new Date().toISOString()
          };
          
          bookmarkManager.add(newBookmark);
          return newBookmark;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bookmarks', bookId] });
        }
      });
    };
  }, [queryClient, bookId]);
  
  const removeBookmark = useMemo(() => {
    return (bookmarkId: string) => {
      console.log('🔖 Removing bookmark:', bookmarkId);
      
      queryClient.mutate({
        mutationFn: async (id: string) => {
          const bookmarkManager = createLocalStorageManager<any>('bookmarks');
          bookmarkManager.remove(id);
          return { success: true };
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bookmarks', bookId] });
        }
      });
    };
  }, [queryClient, bookId]);
  
  return { data: bookmarks, addBookmark, removeBookmark, ...rest };
};
          // 笔记钩子
export const useNotes = (bookId: string) => {
  const queryClient = useQueryClient();
  
  const { data: notes, ...rest } = useQuery({
    queryKey: ['notes', bookId],
    queryFn: async () => {
      console.log('📝 Loading notes from localStorage:', bookId);
      
      const notesManager = createLocalStorageManager<any>('notes');
      const notesData = notesManager.get();
      const bookNotes = notesData.filter((n: any) => n.bookId === bookId);
      
      return bookNotes;
    },
    staleTime: 2 * 60 * 1000, // 2分钟
    retry: 1,
    enabled: !!bookId
  });
  
  const addNote = useMemo(() => {
    return (noteData: {
      chapterId: string;
      sectionId: string;
      content: string;
      range: { start: number; end: number; text: string };
    }) => {
      console.log('📝 Adding note:', bookId, noteData);
      
      queryClient.mutate({
        mutationFn: async (data: typeof noteData) => {
          const notesManager = createLocalStorageManager<any>('notes');
          
          const newNote = {
            id: `note-${Date.now()}`,
            bookId,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          notesManager.add(newNote);
          return newNote;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['notes', bookId] });
        }
      });
    };
  }, [queryClient, bookId]);
  
  const updateNote = useMemo(() => {
    return (noteId: string, content: string) => {
      console.log('📝 Updating note:', noteId, content);
      
      queryClient.mutate({
        mutationFn: async ({ id, content }: { id: string; content: string }) => {
          const notesManager = createLocalStorageManager<any>('notes');
          const notesData = notesManager.get();
          
          const noteIndex = notesData.findIndex((n: any) => n.id === id);
          if (noteIndex !== -1) {
            notesData[noteIndex].content = content;
            notesData[noteIndex].updatedAt = new Date().toISOString();
            notesManager.set(notesData);
            return notesData[noteIndex];
          }
          
          throw new Error('Note not found');
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['notes', bookId] });
        }
      });
    };
  }, [queryClient, bookId]);
  
  const deleteNote = useMemo(() => {
    return (noteId: string) => {
      console.log('📝 Deleting note:', noteId);
      
      queryClient.mutate({
        mutationFn: async (id: string) => {
          const notesManager = createLocalStorageManager<any>('notes');
          notesManager.remove(id);
          return { success: true };
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['notes', bookId] });
        }
      });
    };
  }, [queryClient, bookId]);
  
  return { data: notes, addNote, updateNote, deleteNote, ...rest };
};
