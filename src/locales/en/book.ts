// Temporary compatibility file - redirect to bookDetail
// To maintain compatibility with existing components using book.* translation keys
import { bookDetail } from './labels/pages/book-detail';

// Create book.* aliases mapping to bookDetail.*
export const book = {
  // UI interaction text
  loadingError: bookDetail.ui.loadingError,
  
  // Chapter navigation
  navigation: bookDetail.navigation,
  
  // Book metadata labels
  metadata: {
    ...bookDetail.metadata,
    // Add some additional keys used in components
    title: bookDetail.metadata.title,
    dynasty: bookDetail.metadata.dynasty,
    author: bookDetail.metadata.author,
    chapters: bookDetail.metadata.chapters,
    wordCount: bookDetail.metadata.wordCount,
    category: bookDetail.metadata.category,
    tags: bookDetail.metadata.tags
  },
  
  // Statistics
  stats: {
    chapters: bookDetail.metadata.chapters,
    words: bookDetail.metadata.wordCount,
    tags: bookDetail.metadata.tags,
    rating: 'Rating' // Temporary addition
  },
  
  // Action buttons
  actions: bookDetail.actions,
  
  // Reading statistics
  readingStats: bookDetail.readingStats,
  
  // Chapter information
  chapterInfo: bookDetail.chapterInfo,
  
  // Key concepts
  keyConcepts: bookDetail.keyConcepts,
  
  // Reading tools
  readingTools: {
    ...bookDetail.readingTools,
    // Add some additional keys
    reset: 'Reset',
    progress: 'Progress'
  },
  
  // Reading progress
  readingProgress: bookDetail.readingProgress,
  
  // Related recommendations
  relatedBooks: bookDetail.relatedBooks,
  
  // Category mapping
  categories: {
    ...bookDetail.categories,
    // Add some additional category mappings
    suwen: 'Suwen',
    lingshu: 'Lingshu'
  },
  
  // Content area
  content: {
    ...bookDetail.content,
    // Add chapter navigation related keys
    chapterNavigation: {
      title: bookDetail.navigation.chapters,
      section: bookDetail.content.section
    }
  }
};
