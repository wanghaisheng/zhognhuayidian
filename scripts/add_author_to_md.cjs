
const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content');

// Recursive function to get all md files
function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(getFiles(file));
        } else { 
            if (file.endsWith('.md')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = getFiles(contentDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if author exists
    if (!content.includes('author:')) {
        console.log(`Adding author to ${file}`);
        
        // Insert author after title
        if (content.match(/^title:.*$/m)) {
            content = content.replace(/(^title:.*$)/m, '$1\nauthor: heisenberg');
            fs.writeFileSync(file, content);
        } else {
            // Fallback: insert after first ---
            content = content.replace(/^---\s*\n/, '---\nauthor: heisenberg\n');
            fs.writeFileSync(file, content);
        }
    } else {
        // Check if it's commented out or something? No, simple check for now.
        // console.log(`Skipping ${file} - author already exists`);
    }
});

console.log('Done');
