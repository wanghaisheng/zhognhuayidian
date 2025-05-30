const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const validator = require('validator');

// Path to your sitemap.xml file
const sitemapPath = path.join(__dirname, 'sitemap.xml');
const resultFilePath = path.join(__dirname, 'result.log');

// Read the sitemap.xml file
fs.readFile(sitemapPath, 'utf8', (err, xmlData) => {
    if (err) {
        console.error('Error reading sitemap.xml:', err);
        fs.writeFileSync(resultFilePath, 'Error reading sitemap.xml\n');
        return;
    }

    // Parse the XML
    xml2js.parseString(xmlData, { trim: true, explicitArray: false }, (parseErr, result) => {
        if (parseErr) {
            console.error('Error parsing sitemap.xml:', parseErr);
            fs.writeFileSync(resultFilePath, 'Error parsing sitemap.xml\n');
            return;
        }

        // Validate the sitemap structure
        const urlset = result.urlset;
        if (!urlset || !Array.isArray(urlset.url)) {
            console.error('Invalid sitemap: Missing or malformed <urlset> or <url> tags.');
            fs.writeFileSync(resultFilePath, 'Invalid sitemap: Missing or malformed <urlset> or <url> tags.\n');
            return;
        }

        let isValid = true;
        const validationErrors = [];

        // Check each <url> entry
        urlset.url.forEach((url, index) => {
            // Validate <loc> (URL)
            const loc = url.loc;
            if (!loc || !validator.isURL(loc)) {
                validationErrors.push(`Invalid <loc> URL at index ${index}: ${loc}`);
                isValid = false;
            }

            // Validate <changefreq> (Valid options: always, hourly, daily, weekly, monthly, yearly, never)
            const changefreq = url.changefreq;
            const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
            if (!changefreq || !validChangefreqs.includes(changefreq)) {
                validationErrors.push(`Invalid <changefreq> value at index ${index}: ${changefreq}`);
                isValid = false;
            }

            // Validate <priority> (Value between 0.0 and 1.0)
            const priority = parseFloat(url.priority);
            if (isNaN(priority) || priority < 0.0 || priority > 1.0) {
                validationErrors.push(`Invalid <priority> value at index ${index}: ${priority}`);
                isValid = false;
            }
        });

        // Output validation results to a file
        const validationResult = isValid ? 'Sitemap is valid.' : `Sitemap contains errors:\n${validationErrors.join('\n')}`;
        fs.writeFileSync(resultFilePath, validationResult);
        console.log(validationResult);
    });
});
