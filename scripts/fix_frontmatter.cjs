const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const contentDir = path.resolve(__dirname, '../content');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.md') && !file.toLowerCase().includes('readme.md')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(contentDir);
let fixedCount = 0;

files.forEach(filePath => {
  // Normalize path to check for 'en' folder
  const normalizedPath = filePath.split(path.sep).join('/');
  if (!normalizedPath.includes('/en/')) {
    // console.log(`Skipping non-en file: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  // Handle both LF and CRLF line endings
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);

  if (match) {
    let frontmatterRaw = match[1];
    let frontmatter;
    try {
      frontmatter = yaml.load(frontmatterRaw);
    } catch (e) {
      console.error(`Error parsing YAML in ${filePath}:`, e);
      return;
    }

    let modified = false;
    const filename = path.basename(filePath, '.md');
    const parentDir = path.basename(path.dirname(filePath));

    // 1. Fix Author
    if (!frontmatter.author || frontmatter.author.toLowerCase() === 'heisenberg') {
      frontmatter.author = 'Medical Equipment Expert';
      modified = true;
    }

    // 2. Fix Slug
    if (!frontmatter.slug) {
      frontmatter.slug = filename;
      modified = true;
    }

    // 3. Fix Category
    if (!frontmatter.category) {
      frontmatter.category = parentDir === 'en' ? path.basename(path.dirname(path.dirname(filePath))) : parentDir;
      // Handle case where parent is 'en', take the one above
      if (frontmatter.category === 'en') {
         // This logic is slightly flawed if structure is content/category/en/file.md -> parent is en, grand is category.
         // Let's fix it properly.
         const parts = filePath.split(path.sep);
         const enIndex = parts.lastIndexOf('en');
         if (enIndex > 0) {
            frontmatter.category = parts[enIndex - 1];
         }
      }
      modified = true;
    }

    // 4. Fix Dates
    if (!frontmatter.publishedAt) {
      frontmatter.publishedAt = '2024-01-01';
      modified = true;
    }
    if (!frontmatter.updatedAt) {
      frontmatter.updatedAt = '2024-01-01';
      modified = true;
    }

    // 5. Fix Reading Time
    if (!frontmatter.readingTime) {
      const wordCount = content.split(/\s+/).length;
      frontmatter.readingTime = Math.ceil(wordCount / 200);
      modified = true;
    }

    // 6. Fix Difficulty
    if (!frontmatter.difficulty) {
      frontmatter.difficulty = 'Intermediate';
      modified = true;
    }

    // 7. Fix ContentType
    if (!frontmatter.contentType) {
      frontmatter.contentType = 'guide'; // default
      if (filePath.includes('analysis')) frontmatter.contentType = 'analysis';
      if (filePath.includes('comparison')) frontmatter.contentType = 'comparison';
      if (filePath.includes('history')) frontmatter.contentType = 'history';
      if (filePath.includes('education')) frontmatter.contentType = 'education';
      if (filePath.includes('technology')) frontmatter.contentType = 'technology';
      modified = true;
    }

    // 8. Fix SEO
    if (!frontmatter.seo) {
      frontmatter.seo = {
        title: frontmatter.title || filename,
        description: frontmatter.description || 'Medical imaging content',
        keywords: frontmatter.keywords || ''
      };
      modified = true;
    } else {
        // Ensure keys exist inside seo if they exist at top level
        if (!frontmatter.seo.keywords && frontmatter.keywords) {
            frontmatter.seo.keywords = frontmatter.keywords;
            modified = true;
        }
    }

    if (modified) {
      const newYaml = yaml.dump(frontmatter, { lineWidth: -1 }); // -1 disables line wrapping
      const newContent = content.replace(frontmatterRegex, `---\n${newYaml}---`);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
      fixedCount++;
    }
  }
});

console.log(`Total files fixed: ${fixedCount}`);
