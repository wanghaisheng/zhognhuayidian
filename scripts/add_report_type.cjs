const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const analysisDir = path.resolve(__dirname, '../content/analysis/en');

function updateReportType(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
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

        // Add reportType if missing
        if (!frontmatter.reportType) {
          // Default to market_analysis for existing files as they look like market reports
          frontmatter.reportType = 'market_analysis';
          
          const newYaml = yaml.dump(frontmatter, { lineWidth: -1 });
          const newContent = content.replace(frontmatterRegex, `---\n${newYaml}---`);
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Updated: ${file}`);
        } else {
            console.log(`Skipped (already has reportType): ${file}`);
        }
      }
    }
  });
}

updateReportType(analysisDir);
