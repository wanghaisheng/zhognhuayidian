const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');

const urlsFile = './urls.txt'; // File containing the list of URLs
const resultsFile = './seo-check-results.txt'; // File to save SEO check results

const defaultLang = 'en'; // Default language for checks

// Load URLs from the file
const pages = fs.readFileSync(urlsFile, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0); // Remove empty lines

// Create or overwrite the results file
fs.writeFileSync(resultsFile, 'SEO Check Results:\n\n', 'utf-8');

async function checkPageSEO(pageUrl) {
  try {
    // Fetch HTML content
    const response = await axios.get(pageUrl);
    const html = response.data;

    // Parse the HTML with Cheerio
    const $ = cheerio.load(html);

    // SEO Checks
    const results = [];
    results.push(`Checking SEO for: ${pageUrl}\n`);

    // 1. Title Tag
    const title = $('head title').text();
    if (!title) {
      results.push('[Warning] Missing <title> tag');
    } else if (title.length < 30 || title.length > 60) {
      results.push('[Suggestion] <title> should be between 30-60 characters.');
    }

    // 2. Meta Description
    const description = $('head meta[name="description"]').attr('content');
    if (!description) {
      results.push('[Warning] Missing <meta name="description"> tag');
    } else if (description.length < 50 || description.length > 160) {
      results.push('[Suggestion] <meta name="description"> should be between 50-160 characters.');
    }

    // 3. H1 Tag
    const h1 = $('h1').text();
    if (!h1) {
      results.push('[Warning] Missing <h1> tag');
    } else if (h1.length < 10) {
      results.push('[Suggestion] <h1> should be more descriptive, at least 10 characters.');
    }

    // 4. Missing or incorrect canonical tag
    const canonical = $('head link[rel="canonical"]').attr('href');
    if (!canonical) {
      results.push('[Warning] Missing <link rel="canonical"> tag');
    } else if (canonical !== pageUrl) {
      results.push(`[Suggestion] The <link rel="canonical"> tag should point to the correct page URL: ${pageUrl}`);
    }

    // 5. Base Tag Issues
    const baseHref = $('head base').attr('href');
    if (baseHref && baseHref !== '/') {
      results.push('[Suggestion] <base href="/"> should be used for root-level pages to avoid relative URL issues.');
    }

    // 6. Broken Links (Internal Links)
    const links = $('a[href]');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = $(link).attr('href');

      // Ignore external links
      if (!href || href.startsWith('http') || href.startsWith('https')) continue;

      // Check if internal links are valid (not broken)
      const linkUrl = url.resolve(pageUrl, href);
      try {
        const linkResponse = await axios.head(linkUrl); // Perform a HEAD request to check if the link exists
        if (linkResponse.status !== 200) {
          results.push(`[Warning] Broken link found: ${linkUrl}`);
        }
      } catch (error) {
        results.push(`[Warning] Broken link found: ${linkUrl}`);
      }
    }

    // 7. Missing Alt Text for Images
    const images = $('img');
    images.each(function () {
      const altText = $(this).attr('alt');
      if (!altText) {
        results.push(`[Warning] Image missing <alt> attribute: ${$(this).attr('src')}`);
      }
    });

    // 8. Check Page Load Time (Basic Check)
    const start = Date.now();
    await axios.get(pageUrl); // Measure the time for a full page load
    const loadTime = (Date.now() - start) / 1000;
    if (loadTime > 3) {
      results.push(`[Suggestion] Page load time is too slow, consider optimizing resources. Time: ${loadTime}s`);
    }

    results.push('\n--- End of SEO Check ---\n');

    // Save the results to the file
    fs.appendFileSync(resultsFile, results.join('\n'), 'utf-8');
  } catch (error) {
    console.error(`[Error] Unable to fetch or check page: ${pageUrl}`);
    fs.appendFileSync(resultsFile, `[Error] Unable to fetch or check page: ${pageUrl}\n`, 'utf-8');
  }
}

// Run SEO checks for all pages
async function checkAllPages() {
  for (const page of pages) {
    await checkPageSEO(page);
  }
}

// Run the script
checkAllPages();
