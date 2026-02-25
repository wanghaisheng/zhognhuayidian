// 书籍详情页SEO数据 - 中文
// 此文件为书籍详情页提供SEO元数据
export default {
  title: '{{bookTitle}} - 中医古籍经典 | 中华医典',
  description: '{{bookDescription}} 阅读这部中医经典的原文、白话译文和专家解读，传承中医智慧。',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "{{bookTitle}}",
    "author": {
      "@type": "Person",
      "name": "{{bookAuthor}}"
    },
    "datePublished": "{{publishYear}}",
    "inLanguage": "zh-CN",
    "about": "中医学",
    "description": "{{bookDescription}}",
    "numberOfPages": "{{chapterCount}}",
    "keywords": "{{bookTags}}",
    "publisher": {
      "@type": "Organization",
      "name": "中华医典"
    },
    "genre": ["医经类", "中医学", "{{bookCategory}}"]
  }
}
