// 临时兼容文件 - 重定向到 bookDetail
// 为了兼容现有组件中使用的 book.* 翻译键
import { bookDetail } from './labels/pages/book-detail';

// 创建 book.* 的别名映射到 bookDetail.*
export const book = {
  // UI交互文本
  loadingError: bookDetail.ui.loadingError,
  
  // 章节导航
  navigation: bookDetail.navigation,
  
  // 书籍元数据标签
  metadata: {
    ...bookDetail.metadata,
    // 添加一些组件中使用的额外键
    title: bookDetail.metadata.title,
    dynasty: bookDetail.metadata.dynasty,
    author: bookDetail.metadata.author,
    chapters: bookDetail.metadata.chapters,
    wordCount: bookDetail.metadata.wordCount,
    category: bookDetail.metadata.category,
    tags: bookDetail.metadata.tags
  },
  
  // 统计信息
  stats: {
    chapters: bookDetail.metadata.chapters,
    words: bookDetail.metadata.wordCount,
    tags: bookDetail.metadata.tags,
    rating: '评分' // 临时添加
  },
  
  // 操作按钮
  actions: bookDetail.actions,
  
  // 阅读统计
  readingStats: bookDetail.readingStats,
  
  // 章节信息
  chapterInfo: bookDetail.chapterInfo,
  
  // 关键概念
  keyConcepts: bookDetail.keyConcepts,
  
  // 阅读工具
  readingTools: {
    ...bookDetail.readingTools,
    // 添加一些额外的键
    reset: '重置',
    progress: '进度'
  },
  
  // 阅读进度
  readingProgress: bookDetail.readingProgress,
  
  // 相关推荐
  relatedBooks: bookDetail.relatedBooks,
  
  // 分类映射
  categories: {
    ...bookDetail.categories,
    // 添加一些额外的分类映射
    suwen: '素问',
    lingshu: '灵枢'
  },
  
  // 内容区域
  content: {
    ...bookDetail.content,
    // 添加章节导航相关的键
    chapterNavigation: {
      title: bookDetail.navigation.chapters,
      section: bookDetail.content.section
    }
  }
};
