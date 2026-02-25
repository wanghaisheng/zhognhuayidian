#!/usr/bin/env node

/**
 * Blog Articles Migration Script
 * 
 * This script migrates existing HTML blog articles to Supabase database
 * Converts HTML content to structured data for the new blog system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Blog articles mapping
const BLOG_ARTICLES = [
  {
    file: 'first-ct-scanner.html',
    slug: 'first-ct-scanner',
    category: 'history',
    author: 'Medical Technology Historian',
    tags: ['CT scan', 'computed tomography', 'Sir Godfrey Hounsfield', 'medical imaging', 'history of medicine']
  },
  {
    file: 'battle-for-domestic-ct-market-united-imaging-neusoft-mingfeng.html',
    slug: 'battle-for-domestic-ct-market-united-imaging-neusoft-mingfeng',
    category: 'market-analysis',
    author: 'China Medical Device Industry Association',
    tags: ['United Imaging', 'Neusoft', 'Mingfeng', 'CT market', 'Chinese manufacturers']
  },
  {
    file: 'ct-scanner-development-timeline.html',
    slug: 'ct-scanner-development-timeline',
    category: 'history',
    author: 'Medical Technology Team',
    tags: ['CT development', 'timeline', 'medical imaging history', 'technology evolution']
  },
  {
    file: 'mri-development-timeline.html',
    slug: 'mri-development-timeline',
    category: 'history',
    author: 'Medical Technology Team',
    tags: ['MRI development', 'timeline', 'magnetic resonance imaging', 'technology evolution']
  },
  {
    file: 'import-guide.html',
    slug: 'import-guide',
    category: 'guide',
    author: 'Import Specialist Team',
    tags: ['import guide', 'medical equipment', 'procurement', 'regulations']
  }
];

/**
 * Extract content from HTML file
 */
function extractContentFromHTML(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  // Extract title
  const titleElement = document.querySelector('title') || document.querySelector('h1');
  const title = titleElement ? titleElement.textContent.trim() : '';
  
  // Extract meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  const description = metaDesc ? metaDesc.getAttribute('content') : '';
  
  // Extract meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  const keywords = metaKeywords ? metaKeywords.getAttribute('content').split(',').map(k => k.trim()) : [];
  
  // Extract main content (remove head, scripts, styles)
  const head = document.querySelector('head');
  const scripts = document.querySelectorAll('script');
  const styles = document.querySelectorAll('style');
  
  if (head) head.remove();
  scripts.forEach(script => script.remove());
  styles.forEach(style => style.remove());
  
  // Get body content or full document if no body
  const bodyElement = document.querySelector('body');
  const content = bodyElement ? bodyElement.innerHTML : document.documentElement.innerHTML;
  
  // Extract first paragraph as excerpt
  const firstP = document.querySelector('p');
  const excerpt = firstP ? firstP.textContent.trim().substring(0, 200) + '...' : '';
  
  return {
    title: title.replace(/\s*\|\s*.*$/, ''), // Remove site name from title
    content: content.trim(),
    excerpt: excerpt || description.substring(0, 200) + '...',
    seo_title: title,
    seo_description: description,
    keywords
  };
}

/**
 * Generate multilingual content
 */
function generateMultilingualContent(baseContent, isEnglish = true) {
  if (isEnglish) {
    return {
      title: baseContent.title,
      title_en: baseContent.title,
      title_zh: null, // Will be translated later
      content: baseContent.content,
      content_en: baseContent.content,
      content_zh: null, // Will be translated later
      excerpt: baseContent.excerpt,
      excerpt_en: baseContent.excerpt,
      excerpt_zh: null, // Will be translated later
      seo_title: baseContent.seo_title,
      seo_description: baseContent.seo_description
    };
  }
  
  return {
    title: baseContent.title,
    title_zh: baseContent.title,
    title_en: null, // Will be translated later
    content: baseContent.content,
    content_zh: baseContent.content,
    content_en: null, // Will be translated later
    excerpt: baseContent.excerpt,
    excerpt_zh: baseContent.excerpt,
    excerpt_en: null, // Will be translated later
    seo_title: baseContent.seo_title,
    seo_description: baseContent.seo_description
  };
}

/**
 * Migrate a single blog article
 */
async function migrateBlogArticle(articleConfig) {
  const blogDir = path.join(__dirname, '../data/choose-chinese-made-ct-mri-device-main/blog');
  const filePath = path.join(blogDir, articleConfig.file);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${articleConfig.file}`);
    return null;
  }
  
  try {
    console.log(`📄 Processing: ${articleConfig.file}`);
    
    // Read HTML file
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    
    // Extract content
    const extractedContent = extractContentFromHTML(htmlContent);
    
    // Determine if content is primarily English or Chinese
    const isEnglish = /^[a-zA-Z\s\d\W]*$/.test(extractedContent.title.substring(0, 50));
    
    // Generate multilingual content
    const multilingualContent = generateMultilingualContent(extractedContent, isEnglish);
    
    // Combine tags from extracted keywords and predefined tags
    const allTags = [...new Set([...extractedContent.keywords, ...articleConfig.tags])];
    
    // Prepare article data
    const articleData = {
      ...multilingualContent,
      slug: articleConfig.slug,
      category: articleConfig.category,
      tags: allTags,
      author: articleConfig.author,
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select();
    
    if (error) {
      console.error(`❌ Error inserting ${articleConfig.slug}:`, error);
      return null;
    }
    
    console.log(`✅ Successfully migrated: ${articleConfig.slug}`);
    return data[0];
    
  } catch (error) {
    console.error(`❌ Error processing ${articleConfig.file}:`, error);
    return null;
  }
}

/**
 * Main migration function
 */
async function migrateAllBlogArticles() {
  console.log('🚀 Starting blog articles migration...\n');
  
  // Check Supabase connection
  try {
    const { data, error } = await supabase.from('articles').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful\n');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    process.exit(1);
  }
  
  const results = [];
  
  for (const articleConfig of BLOG_ARTICLES) {
    const result = await migrateBlogArticle(articleConfig);
    if (result) {
      results.push(result);
    }
    console.log(''); // Add spacing between articles
  }
  
  console.log(`\n📊 Migration Summary:`);
  console.log(`   Total articles processed: ${BLOG_ARTICLES.length}`);
  console.log(`   Successfully migrated: ${results.length}`);
  console.log(`   Failed: ${BLOG_ARTICLES.length - results.length}`);
  
  if (results.length > 0) {
    console.log('\n✅ Migrated articles:');
    results.forEach(article => {
      console.log(`   - ${article.slug} (${article.category})`);
    });
  }
  
  console.log('\n🎉 Blog migration completed!');
  
  // Generate URL redirects for existing URLs
  console.log('\n📋 URL Redirects needed:');
  BLOG_ARTICLES.forEach(article => {
    console.log(`   /blog/${article.slug} → /blog/${article.slug} (already matches)`);
  });
}

/**
 * CLI interface
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check environment variables
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   VITE_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  migrateAllBlogArticles().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

export { migrateBlogArticle, migrateAllBlogArticles };