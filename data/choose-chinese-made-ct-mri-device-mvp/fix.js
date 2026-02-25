const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Load the configuration file
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
    console.error('Error: config.json not found.');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const baseurl = config.baseurl; // Read baseurl from config.json
const defaultLang = config.defaultLang || 'en'; // Read defaultLang from config.json, fallback to 'en'

// Define the root folder path
const rootFolder = path.join(__dirname, ''); // Current directory, modify if needed

// Function to process each folder's index.html file
function processLanguageFolder(folderName) {
    const folderPath = path.join(rootFolder, folderName);
    const indexFilePath = path.join(folderPath, 'index.html');

    // Check if the folder contains index.html
    if (fs.existsSync(indexFilePath)) {
        console.log(`Processing: ${indexFilePath}`);

        // Read the index.html file
        const html = fs.readFileSync(indexFilePath, 'utf-8');

        // Load the HTML with Cheerio for manipulation
        const $ = cheerio.load(html);

        // Fix the <base> tag: set the href based on the folder
        const baseHref = folderName === defaultLang ? '/' : `/${folderName}/`;
        $('head').find('base').remove(); // Remove existing base tag if any
        $('head').append(`<base href="${baseHref}">`);

        // Fix the <link rel="canonical"> tag
        const canonicalHref = folderName === defaultLang ? `${baseurl}/` : `${baseurl}/${folderName}/`;
        $('head').find('link[rel="canonical"]').remove(); // Remove existing canonical tag if any
        $('head').append(`<link rel="canonical" href="${canonicalHref}">`);

        // Save the modified index.html file
        fs.writeFileSync(indexFilePath, $.html(), 'utf-8');
        console.log(`Updated: ${indexFilePath}`);
    } else {
        console.log(`Skipping: ${indexFilePath} (No index.html found)`);
    }
}

// Process the root directory and each language folder (e.g., en, fr, zh)
fs.readdirSync(rootFolder).forEach(folderName => {
    const folderPath = path.join(rootFolder, folderName);

    // Only process directories
    if (fs.statSync(folderPath).isDirectory() && folderName !== 'node_modules') {
        processLanguageFolder(folderName);
    }
});
