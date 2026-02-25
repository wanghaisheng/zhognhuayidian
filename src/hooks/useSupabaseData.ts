// 简化的数据类型定义 - 兼容现有代码
// 实际数据获取现在通过 useTCMData hooks 进行

// 古籍类型
export interface Book {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  category: string;
  description: string;
  tags: string[];
  content?: string;
}

// 研究论文类型
export interface Paper {
  id: string;
  title: string;
  author: string;
  institution: string;
  publishDate: string;
  category: string;
  keywords: string[];
  abstract: string;
}

// 症状类型
export interface Symptom {
  id: string;
  name: string;
  description: string;
  category: string;
  relatedPrescriptions: string[];
}

// 方剂类型
export interface Prescription {
  id: string;
  name: string;
  functions: string;
  ingredients: string[];
  indications: string[];
  contraindications: string[];
}

// 兼容性类型别名
export type Device = Book;
export type Manufacturer = {
  id: string;
  name: string;
  description: string;
};
export type Article = Paper;
export type Customer = {
  id: string;
  name: string;
  description: string;
};

// 查询键生成函数
export const getArticlesAllQueryKey = (locale: string) => ['supabase', 'articles', 'all', locale];
export const getArticleBySlugQueryKey = (slug: string, locale: string) => ['supabase', 'article', slug, locale];
export const getArticlesByCategoryQueryKey = (category: string, locale: string) => ['supabase', 'articles', category, locale];

// 模拟数据获取函数
export const fetchArticlesAll = async () => {
  // 返回空数组，因为博客功能在中华医典中不使用
  return { data: [] };
};

export const fetchArticlesByCategory = async (category: string) => {
  // 返回空数组，因为博客功能在中华医典中不使用
  return { data: [] };
};

export const fetchArticleBySlug = async (slug: string) => {
  // 返回null，因为博客功能在中华医典中不使用
  return { data: null };
};

// 字段映射函数
export const mapLocalizedFields = (data: Record<string, unknown>, locale: string) => {
  return data;
};

// 客户映射函数
export const mapCustomer = (customer: any) => customer;

// 空的数据管理器
export const dataManager = {
  devices: [],
  manufacturers: [],
  articles: [],
  customers: []
};
