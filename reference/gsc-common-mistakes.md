Okay, here is a checklist focusing on common mistakes made *within or related to Google Search Console (GSC)* configuration and signals that can lead to indexing problems, along with how to avoid them.

**Google Search Console Indexing Mistakes Checklist**

This checklist helps identify common configuration errors or missed signals within GSC (or related technical elements reported by GSC) that prevent pages from being indexed.

**1. Robots.txt Misconfiguration**

*   **Mistake:** Accidentally blocking important parts of your site (or the entire site) using `Disallow` directives in your `robots.txt` file.
*   **How it Causes Non-Indexing:** Tells Googlebot it's not allowed to crawl specific URLs or directories. If Googlebot can't crawl, it can't index.
*   **Where to Check in GSC:**
    *   Go to `Settings` > `Crawl stats` > `Hosts` status > Click your host > Check `Robots.txt fetching`.
    *   Use the **Robots.txt Tester** (accessible via a link in the old GSC interface documentation, or by searching "Google Robots.txt Tester" - it still works). Test specific important URLs against your live `robots.txt`.
    *   Check `Pages` > `Not indexed` report for the reason "`Blocked by robots.txt`".
    *   Use the `URL Inspection Tool` on a specific URL – it will state if crawling is blocked by `robots.txt`.
*   **How to Avoid/Fix:**
    *   **Be Specific:** Only `Disallow` URLs you genuinely don't want crawled (e.g., admin logins, sensitive directories, search result pages).
    *   **Avoid Broad Blocks:** Never use `Disallow: /` unless you intend to block the *entire* site. Be careful with wildcards (`*`).
    *   **Allow Essential Resources:** Ensure CSS, JS, and critical image files needed for rendering are *not* disallowed.
    *   **Test Before Deploying:** Use the Robots.txt Tester before uploading changes.

**2. Incorrect `noindex` Implementation**

*   **Mistake:** Having a `noindex` directive in the meta tag (`<meta name="robots" content="noindex">`) or X-Robots-Tag HTTP header for pages you *want* indexed. Often left over from development or staging environments.
*   **How it Causes Non-Indexing:** Explicitly tells Google not to include the page in its index, even if it can crawl it.
*   **Where to Check in GSC:**
    *   Use the `URL Inspection Tool` on the specific URL. Check the "Indexing allowed?" section. If it says "No: 'noindex' detected in 'robots' meta tag" or "...in 'X-Robots-Tag' http header", this is the issue.
    *   Check `Pages` > `Not indexed` report for the reason "`Excluded by 'noindex' tag`".
*   **How to Avoid/Fix:**
    *   **Remove Unintended `noindex`:** Inspect the page's HTML source `<head>` section and server HTTP headers for the `noindex` directive and remove it.
    *   **CMS Settings:** Check your CMS settings (e.g., WordPress page visibility options) as they often provide checkboxes to add `noindex`.
    *   **Staging Environments:** Ensure development/staging sites use `noindex` (or password protection / robots.txt disallow) but that these are *removed* when deploying to live.

**3. Sitemap Issues**

*   **Mistake:**
    *   Not submitting a sitemap.
    *   Submitting a sitemap with errors (e.g., incorrect format, including non-canonical URLs, blocked URLs, 404s, or redirects).
    *   Not keeping the sitemap updated.
*   **How it Causes Non-Indexing:** Google might struggle to discover all your pages efficiently, especially new or deep pages. Errors can cause Google to distrust or ignore the sitemap.
*   **Where to Check in GSC:**
    *   Go to `Sitemaps`. Check if your sitemap is submitted. Look for "Status" (Success or Errors). Click on the sitemap name to see details and any discovered errors/warnings.
    *   Check the "See page indexing" link within the sitemap details to see how many submitted URLs are actually indexed.
*   **How to Avoid/Fix:**
    *   **Submit a Sitemap:** Create and submit an accurate XML sitemap.
    *   **Validate:** Use a sitemap validator tool before submitting.
    *   **Clean URLs:** Ensure your sitemap only includes canonical, indexable (200 OK status), non-blocked URLs you want indexed.
    *   **Keep Updated:** Automate sitemap generation and submission if possible, or update it regularly when content changes.

**4. Canonical Tag Misuse**

*   **Mistake:** Setting the canonical tag (`<link rel="canonical" href="...">`) incorrectly, pointing important pages to a different URL (e.g., all pages pointing to the homepage, pointing to a non-indexable version).
*   **How it Causes Non-Indexing:** Tells Google that another URL is the "master" version, so the current page shouldn't be indexed in favour of the canonical URL.
*   **Where to Check in GSC:**
    *   Use the `URL Inspection Tool`. Check the "User-declared canonical" and "Google-selected canonical" under the "Indexing" section. If Google selects a different canonical than the page you inspected (and the inspected page isn't indexed), this might be the cause or a symptom.
    *   Check `Pages` > `Not indexed` report for reasons like "`Duplicate, Google chose different canonical than user`" or "`Alternate page with proper canonical tag`".
*   **How to Avoid/Fix:**
    *   **Self-Referencing Canonicals:** For unique pages, the canonical URL should usually point to the page itself.
    *   **Correct Version:** Ensure the canonical points to the correct protocol (HTTPS), domain version (www vs. non-www), and path (trailing slash vs. non-trailing slash) that you want indexed.
    *   **Consolidate Duplicates:** Use canonicals intentionally to point duplicate or very similar content pages to the single version you want indexed.

**5. Incorrect Domain Property Setup / Version Coverage**

*   **Mistake:** Only verifying one version of your site (e.g., `http://example.com`) when the main, indexable version is different (e.g., `https://www.example.com`). You might miss errors or signals related to the correct version.
*   **How it Causes Non-Indexing (Indirectly):** You might not be looking at the data for the version Google is actually trying to index, thus missing crucial error reports (like crawl errors or `noindex` tags) specific to that version.
*   **Where to Check in GSC:**
    *   Go to `Settings` > `Ownership verification`. Check which properties are verified.
    *   Use the dropdown menu at the top left to see all verified properties.
*   **How to Avoid/Fix:**
    *   **Use Domain Property:** If possible, verify using the "Domain Property" method. This covers all subdomains (www, non-www) and protocols (http, https) automatically.
    *   **Verify All Versions:** If using URL-Prefix properties, ensure you have verified *all four* main versions (http://, https://, http://www., https://www.) or at least the primary one Google is indexing (use URL Inspection to confirm which one Google sees).
    *   **Set Preferred Domain (Implicit):** Ensure your server correctly 301 redirects all non-preferred versions to your single, canonical, preferred version (usually HTTPS, and either www or non-www). GSC generally respects these redirects.

**6. Ignoring Crawl Errors**

*   **Mistake:** Not monitoring or fixing server errors (5xx), not found errors (404) for important pages, or access denied errors (403).
*   **How it Causes Non-Indexing:** If Googlebot encounters errors when trying to crawl a page, it can't retrieve the content to index it. Repeated errors can lead to Google crawling less frequently.
*   **Where to Check in GSC:**
    *   Use the `URL Inspection Tool` on specific URLs – it will report crawl errors encountered during the last crawl attempt.
    *   Go to `Pages` > `Not indexed` report. Look for reasons like "`Server error (5xx)`", "`Not found (404)`", "`Access denied due to authorization requirement (401)`, `Access forbidden (403)`.
    *   Go to `Settings` > `Crawl stats` report to see overall server connectivity and response codes over time.
*   **How to Avoid/Fix:**
    *   **Monitor Regularly:** Check the `Pages` report and `Crawl stats` frequently.
    *   **Fix Server Issues:** Ensure your server is stable and configured correctly. Address 5xx errors immediately.
    *   **Manage 404s:** Fix broken internal links. For removed pages that have backlinks or traffic, implement a 301 redirect to the most relevant live page. Let legitimate 404s remain 404s if the page is truly gone and has no replacement.
    *   **Check Access:** Ensure Googlebot isn't being blocked by firewall rules, CDN settings, or `.htaccess` rules (leading to 401/403 errors).

**7. Manual Actions or Security Issues**

*   **Mistake:** Violating Google's Webmaster Guidelines leading to a manual action, or having the site compromised with malware/spam.
*   **How it Causes Non-Indexing:** Google may partially or fully de-index a site that has received a manual penalty or is flagged for security issues to protect users.
*   **Where to Check in GSC:**
    *   Go to `Security & Manual Actions` > `Manual actions`. Check for any listed actions.
    *   Go to `Security & Manual Actions` > `Security issues`. Check for any detected problems like malware or hacking.
*   **How to Avoid/Fix:**
    *   **Follow Guidelines:** Adhere strictly to Google's Webmaster Guidelines (avoid spammy tactics, cloaking, unnatural links, etc.).
    *   **Secure Your Site:** Keep CMS, plugins, and themes updated. Use strong passwords. Implement security measures.
    *   **Address Immediately:** If a manual action or security issue is reported, follow the instructions provided in GSC carefully to fix the problem and submit a reconsideration request (for manual actions) or review request (for security issues).

**Regular Check Routine:**

*   Perform a quick check of the GSC `Pages` report (especially 'Not indexed' reasons) and `Sitemaps` weekly.
*   Use the `URL Inspection Tool` whenever you publish important new content or encounter indexing issues with a specific page.
*   Review `Manual Actions` and `Security Issues` periodically (monthly or if you suspect problems).

By regularly checking these areas in Google Search Console and understanding how these elements interact, you can proactively avoid many common technical mistakes that prevent your site from getting indexed properly.