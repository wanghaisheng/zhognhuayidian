// Book detail page SEO data - English
// This file provides SEO metadata for book detail pages
export default {
  title: '{{bookTitle}} - Ancient Chinese Medical Classic | Chinese Medical Classics',
  description: '{{bookDescription}} Read the original text, modern translation, and expert interpretation of this traditional Chinese medicine classic.',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "{{bookTitle}}",
    "author": {
      "@type": "Person",
      "name": "{{bookAuthor}}"
    },
    "datePublished": "{{publishYear}}",
    "inLanguage": "en",
    "about": "Traditional Chinese Medicine",
    "description": "{{bookDescription}}",
    "numberOfPages": "{{chapterCount}}",
    "keywords": "{{bookTags}}",
    "publisher": {
      "@type": "Organization",
      "name": "Chinese Medical Classics"
    },
    "genre": ["Medical Classics", "Traditional Chinese Medicine", "{{bookCategory}}"]
  }
}
