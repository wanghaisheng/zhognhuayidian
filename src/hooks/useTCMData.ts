import { useQuery } from '@tanstack/react-query'

// 古籍数据
export const useAncientBooks = () => {
  return useQuery({
    queryKey: ['ancient-books'],
    queryFn: async () => {
      console.log('📚 Loading ancient books from snapshots');
      
      // 使用项目标准的静态文件加载模式 - import.meta.glob
      const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
      const targetLocale = 'zh'; // 默认使用中文
      
      const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/collection.json`;
      const fallbackPath = `/src/data/snapshots/en/content/ancient-books/collection.json`;
      
      console.log('Available ancient book paths:', Object.keys(snapshotMap));
      console.log('Attempting to load ancient books from:', snapshotPath);
      
      const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
      
      if (loader) {
        console.log('Found ancient books loader, loading data...');
        const mod = await loader();
        const data = (mod as any).default || mod;
        console.log('Loaded ancient books data:', data);
        return data;
      } else {
        console.log('No ancient books loader found, using fallback data');
        
        // 回退到硬编码数据
        return {
          books: [
            {
              id: 'huangdi-neijing',
              title: '黄帝内经',
              author: '佚名',
              dynasty: '先秦',
              tags: ['医经', '基础理论', '黄帝', '阴阳', '五行'],
              description: '中医理论奠基之作'
            }
          ]
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  })
}

// 研究论文数据
export const useResearchPapers = () => {
  return useQuery({
    queryKey: ['research-papers'],
    queryFn: async () => {
      console.log('📄 Loading research papers from snapshots');
      
      // 使用项目标准的静态文件加载模式 - import.meta.glob
      const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/research/*.json', { eager: false });
      const targetLocale = 'zh'; // 默认使用中文
      
      const snapshotPath = `/src/data/snapshots/${targetLocale}/content/research/papers.json`;
      const fallbackPath = `/src/data/snapshots/en/content/research/papers.json`;
      
      const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
      
      if (loader) {
        console.log('Found research papers loader, loading data...');
        const mod = await loader();
        const data = (mod as any).default || mod;
        console.log('Loaded research papers data:', data);
        return data;
      } else {
        console.log('No research papers loader found, using fallback data');
        
        // 回退到硬编码数据
        return {
          papers: [
            {
              id: 'paper-1',
              title: '中医现代化研究进展',
              author: '张三',
              keywords: ['中医', '现代化', '研究'],
              abstract: '中医现代化研究的最新进展...'
            }
          ]
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

// 症状和方剂数据
export const useSymptomsPrescriptions = () => {
  return useQuery({
    queryKey: ['symptoms-prescriptions'],
    queryFn: async () => {
      console.log('🌿 Loading symptoms and prescriptions from snapshots');
      
      // 使用项目标准的静态文件加载模式 - import.meta.glob
      const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/tcm/*.json', { eager: false });
      const targetLocale = 'zh'; // 默认使用中文
      
      const snapshotPath = `/src/data/snapshots/${targetLocale}/content/tcm/symptoms-prescriptions.json`;
      const fallbackPath = `/src/data/snapshots/en/content/tcm/symptoms-prescriptions.json`;
      
      const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
      
      if (loader) {
        console.log('Found symptoms prescriptions loader, loading data...');
        const mod = await loader();
        const data = (mod as any).default || mod;
        console.log('Loaded symptoms prescriptions data:', data);
        return data;
      } else {
        console.log('No symptoms prescriptions loader found, using fallback data');
        
        // 回退到硬编码数据
        return {
          symptoms: [
            {
              id: 'symptom-1',
              name: '头痛',
              description: '头部疼痛症状'
            }
          ],
          prescriptions: [
            {
              id: 'prescription-1',
              name: '川芎茶调散',
              functions: '疏风止痛'
            }
          ]
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

// 搜索功能
export const useTCMSearch = (query: string) => {
  return useQuery({
    queryKey: ['tcm-search', query],
    queryFn: async () => {
      if (!query.trim()) return { books: [], papers: [], symptoms: [], prescriptions: [] }
      
      console.log('🔍 Performing TCM search from snapshots:', query);
      
      // 使用项目标准的静态文件加载模式 - import.meta.glob
      const booksSnapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
      const papersSnapshotMap = import.meta.glob('/src/data/snapshots/*/content/research/*.json', { eager: false });
      const tcmSnapshotMap = import.meta.glob('/src/data/snapshots/*/content/tcm/*.json', { eager: false });
      
      const targetLocale = 'zh'; // 默认使用中文
      
      // 加载所有数据源
      const booksPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/collection.json`;
      const papersPath = `/src/data/snapshots/${targetLocale}/content/research/papers.json`;
      const tcmPath = `/src/data/snapshots/${targetLocale}/content/tcm/symptoms-prescriptions.json`;
      
      const booksLoader = booksSnapshotMap[booksPath] || booksSnapshotMap[`/src/data/snapshots/en/content/ancient-books/collection.json`];
      const papersLoader = papersSnapshotMap[papersPath] || papersSnapshotMap[`/src/data/snapshots/en/content/research/papers.json`];
      const tcmLoader = tcmSnapshotMap[tcmPath] || tcmSnapshotMap[`/src/data/snapshots/en/content/tcm/symptoms-prescriptions.json`];
      
      // 并行加载所有数据
      const [booksData, papersData, symptomsData] = await Promise.allSettled([
        booksLoader ? booksLoader().then(mod => (mod as any).default || mod) : Promise.resolve({ books: [] }),
        papersLoader ? papersLoader().then(mod => (mod as any).default || mod) : Promise.resolve({ papers: [] }),
        tcmLoader ? tcmLoader().then(mod => (mod as any).default || mod) : Promise.resolve({ symptoms: [], prescriptions: [] })
      ]);
      
      // 提取成功的数据
      const books = booksData.status === 'fulfilled' ? booksData.value.books || [] : [];
      const papers = papersData.status === 'fulfilled' ? papersData.value.papers || [] : [];
      const symptoms = symptomsData.status === 'fulfilled' ? symptomsData.value.symptoms || [] : [];
      const prescriptions = symptomsData.status === 'fulfilled' ? symptomsData.value.prescriptions || [] : [];
      
      // 简单的搜索逻辑
      const searchLower = query.toLowerCase();
      const filteredBooks = books.filter((book: any) => 
        book.title?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
      
      const filteredPapers = papers.filter((paper: any) =>
        paper.title?.toLowerCase().includes(searchLower) ||
        paper.author?.toLowerCase().includes(searchLower) ||
        paper.keywords?.some((keyword: string) => keyword.toLowerCase().includes(searchLower))
      );
      
      const filteredSymptoms = symptoms.filter((symptom: any) =>
        symptom.name?.toLowerCase().includes(searchLower) ||
        symptom.description?.toLowerCase().includes(searchLower)
      );
      
      const filteredPrescriptions = prescriptions.filter((prescription: any) =>
        prescription.name?.toLowerCase().includes(searchLower) ||
        prescription.functions?.toLowerCase().includes(searchLower)
      );
      
      console.log('TCM search results:', {
        books: filteredBooks.length,
        papers: filteredPapers.length,
        symptoms: filteredSymptoms.length,
        prescriptions: filteredPrescriptions.length
      });
      
      return {
        books: filteredBooks,
        papers: filteredPapers,
        symptoms: filteredSymptoms,
        prescriptions: filteredPrescriptions
      };
    },
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2分钟
  })
}

// 获取单个古籍详情
export const useAncientBook = (id: string) => {
  return useQuery({
    queryKey: ['ancient-book', id],
    queryFn: async () => {
      console.log('📖 Loading ancient book details from snapshots:', id);
      
      // 使用项目标准的静态文件加载模式 - import.meta.glob
      const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
      const targetLocale = 'zh'; // 默认使用中文
      
      // 处理bookId映射：suwen -> huangdi-neijing
      const actualBookId = id === 'suwen' ? 'huangdi-neijing' : id;
      
      const snapshotPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/${actualBookId}.json`;
      const fallbackPath = `/src/data/snapshots/en/content/ancient-books/${actualBookId}.json`;
      
      const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
      
      if (loader) {
        console.log('Found ancient book loader, loading data...');
        const mod = await loader();
        const data = (mod as any).default || mod;
        console.log('Loaded ancient book data:', data);
        
        // 检查数据结构
        if (data.content) {
          return data.content;
        } else if (data.id) {
          return data;
        }
      }
      
      console.log('No ancient book loader found, checking collection...');
      
      // 回退到从collection中查找
      const collectionPath = `/src/data/snapshots/${targetLocale}/content/ancient-books/collection.json`;
      const collectionFallbackPath = `/src/data/snapshots/en/content/ancient-books/collection.json`;
      
      const collectionLoader = snapshotMap[collectionPath] || snapshotMap[collectionFallbackPath];
      
      if (collectionLoader) {
        const mod = await collectionLoader();
        const data = (mod as any).default || mod;
        const book = data.books?.find((b: any) => b.id === id || b.id === actualBookId);
        
        if (book) {
          console.log('Found book in collection:', book);
          return book;
        }
      }
      
      throw new Error('Book not found');
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  })
}

// 获取单个研究论文详情
export const useResearchPaper = (id: string) => {
  return useQuery({
    queryKey: ['research-paper', id],
    queryFn: async () => {
      console.log('📄 Loading research paper details from snapshots:', id);
      
      // 使用项目标准的静态文件加载模式 - import.meta.glob
      const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/research/*.json', { eager: false });
      const targetLocale = 'zh'; // 默认使用中文
      
      const snapshotPath = `/src/data/snapshots/${targetLocale}/content/research/papers.json`;
      const fallbackPath = `/src/data/snapshots/en/content/research/papers.json`;
      
      const loader = snapshotMap[snapshotPath] || snapshotMap[fallbackPath];
      
      if (loader) {
        console.log('Found research papers loader, loading data...');
        const mod = await loader();
        const data = (mod as any).default || mod;
        const paper = data.papers?.find((p: any) => p.id === id);
        
        if (paper) {
          console.log('Found research paper:', paper);
          return paper;
        }
      }
      
      throw new Error('Paper not found');
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}
