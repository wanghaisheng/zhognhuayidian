const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class GSCValidator {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.errors = [];
        this.warnings = [];
    }

    validateHTML(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        const relativePath = path.relative(this.baseDir, filePath);

        // Check 1: noindex validation
        const noindex = $('meta[name="robots"][content*="noindex"]').length > 0;
        if (noindex) {
            this.errors.push(`${relativePath}: Contains noindex tag`);
        }

        // Check 2: Canonical tag validation
        const canonicals = $('link[rel="canonical"]');
        if (canonicals.length === 0) {
            this.warnings.push(`${relativePath}: Missing canonical tag`);
        } else if (canonicals.length > 1) {
            this.errors.push(`${relativePath}: Multiple canonical tags found`);
        } else {
            const canonicalHref = canonicals.attr('href');
            if (!canonicalHref || canonicalHref.trim() === '') {
                this.errors.push(`${relativePath}: Empty canonical URL`);
            }
        }

        // Check 3: Validate internal links
        $('a[href]').each((_, element) => {
            const href = $(element).attr('href');
            if (href.startsWith('/') && href.endsWith('/')) {
                this.warnings.push(`${relativePath}: Internal link with trailing slash: ${href}`);
            }
        });

        // Check 4: Meta description
        if ($('meta[name="description"]').length === 0) {
            this.warnings.push(`${relativePath}: Missing meta description`);
        }

        // Check 5: Title tag
        if ($('title').length === 0) {
            this.errors.push(`${relativePath}: Missing title tag`);
        }

        // Check 6: Validate heading hierarchy
        const h1Count = $('h1').length;
        if (h1Count === 0) {
            this.errors.push(`${relativePath}: Missing H1 tag`);
        } else if (h1Count > 1) {
            this.warnings.push(`${relativePath}: Multiple H1 tags found`);
        }
    }

    validateDirectory() {
        const htmlFiles = this.findHtmlFiles(this.baseDir);
        htmlFiles.forEach(file => this.validateHTML(file));
        return {
            errors: this.errors,
            warnings: this.warnings,
            success: this.errors.length === 0
        };
    }

    findHtmlFiles(dir) {
        const files = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                files.push(...this.findHtmlFiles(fullPath));
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                files.push(fullPath);
            }
        }

        return files;
    }
}

// Run validation
const baseDir = path.resolve(__dirname, '..');
const validator = new GSCValidator(baseDir);
const results = validator.validateDirectory();

// Output results
console.log('\n=== GSC Validation Results ===\n');

if (results.errors.length > 0) {
    console.log('❌ Errors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
    console.log('');
}

if (results.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    results.warnings.forEach(warning => console.log(`  - ${warning}`));
    console.log('');
}

if (results.success) {
    console.log('✅ No critical GSC issues found!\n');
} else {
    console.log('❌ Please fix the above errors before deploying.\n');
    process.exit(1);
}