// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.367Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ArticleData {
    title: string;
    slug: string;
    category: string;
    content: string;
    excerpt: string;
    published: boolean;
    published_at?: string;
    tags?: string[];
    author_id?: string;
    // Multilingual fields
    title_en?: string;
    content_en?: string;
    excerpt_en?: string;
    title_zh?: string;
    content_zh?: string;
    excerpt_zh?: string;
}

// Function to recursively walk directory
function walkDir(dir: string, callback: (filePath: string) => void) {
    fs.readdirSync(dir).forEach((f) => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

// Function to parse frontmatter and content
function parseMarkdown(fileContent: string): { data: Record<string, unknown>; content: string } {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
    const match = fileContent.match(frontmatterRegex);

    if (match) {
        const frontmatter = match[1];
        const content = fileContent.slice(match[0].length).trim();
        try {
            const data = yaml.load(frontmatter) as Record<string, unknown>;
            return { data, content };
        } catch (e) {
            console.error('Error parsing YAML:', e);
            return { data: {}, content: fileContent };
        }
    }

    return { data: {}, content: fileContent };
}

async function migrateMarkdownFiles() {
    console.log('🚀 Starting Markdown migration...');
    const contentDir = path.join(__dirname, '../content');

    if (!fs.existsSync(contentDir)) {
        console.error(`❌ Content directory not found: ${contentDir}`);
        return;
    }

    const files: string[] = [];
    walkDir(contentDir, (filePath) => {
        if (filePath.endsWith('.md')) {
            files.push(filePath);
        }
    });

    console.log(`Found ${files.length} markdown files.`);

    for (const filePath of files) {
        const relativePath = path.relative(contentDir, filePath);
        console.log(`Processing: ${relativePath}`);

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = parseMarkdown(fileContent);

        // Infer category from directory structure (e.g. content/technology/...)
        const pathParts = relativePath.split(path.sep);
        let category = 'blog';
        if (pathParts.length > 1) {
            // content/category/lang/file.md OR content/category/file.md
            category = pathParts[0];
        }

        // Check language
        const isChinese = relativePath.includes('/zh/') || relativePath.includes('\\zh\\');

        const slug = data.slug || path.basename(filePath, '.md');
        const title = data.title || slug.replace(/-/g, ' '); // Fallback title
        const excerpt = data.excerpt || data.description || content.substring(0, 150) + '...';

        // Construct DB payload
        // We assume english default for non-lang specific folders, generic logic
        const articlePayload: ArticleData = {
            title: title, // Main title field (required)
            slug: slug,
            category: category,
            content: content,
            excerpt: excerpt,
            published: data.published !== false, // Default to true unless explicitly false
            published_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            tags: data.tags || [],
        };

        // Populate multilingual fields
        if (isChinese) {
            articlePayload.title_zh = title;
            articlePayload.content_zh = content;
            articlePayload.excerpt_zh = excerpt;
            // Keep main fields as fallback or if english missing? 
            // Strategy: If existing article ID matches slug, update language fields. 
            // BUT current DB schema might only have flat rows. 
            // Assuming row-per-locale OR wide-table.
            // Looking at 'articles' schema (inferred), usually it's one row per article (monolingual) or row per article (multilingual columns).
            // Let's assume standard columns (title, content) are English/Default. 
            // If we want to support multilingual properly, we need to know the schema.
            // The migrate-blog-articles.js used title_en, title_zh... so the table likely has them.
        } else {
            articlePayload.title_en = title;
            articlePayload.content_en = content;
            articlePayload.excerpt_en = excerpt;
        }

        // Try to Upsert based on slug
        // Note: Upsert needs to handle merging if we have en and zh files separate.
        // If we process EN first then ZH, we want to update the same row.
        // We can check if slug exists first.

        try {
            const { data: existing } = await supabase.from('articles').select('id').eq('slug', slug).single();

            if (existing) {
                console.log(`   Updating existing article ${existing.id}...`);
                const { error } = await supabase.from('articles').update(articlePayload).eq('id', existing.id);
                if (error) console.error(`   ❌ Update failed: ${error.message}`);
            } else {
                console.log(`   Creating new article...`);
                const { error } = await supabase.from('articles').insert(articlePayload);
                if (error) console.error(`   ❌ Insert failed: ${error.message}`);
            }

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error(`   ❌ Error: ${errorMessage}`);
        }
    }

    console.log('🎉 Migration finished.');
}

// Run (Self-executing if called directly)
// Note: In TS file, tricky to check require.main === module. 
// We will just export it and rely on user to run a command that invokes it, 
// OR just run it. 
// For now, I'll export it and also call it if it seems to be the entry point.
// Actually, I'll just call it at the end, assuming this script is run for this purpose.
migrateMarkdownFiles().catch(console.error);

export { migrateMarkdownFiles };
