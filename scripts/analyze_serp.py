from DrissionPage import ChromiumPage
from bs4 import BeautifulSoup
import os
import json
import time
from pathlib import Path
from getbrowser import setup_chrome
import re
import xml.etree.ElementTree as ET

class SEOAnalyzer:
    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.browser = setup_chrome()
        self.results = {}
        self.exclude_patterns = os.getenv('EXCLUDE_PATTERNS', '').split(',')

    def should_analyze_url(self, url):
        # Skip utility pages
        for pattern in self.exclude_patterns:
            if pattern and pattern.strip() in url.lower():
                return False
        return True

    def get_urls_from_sitemap(self):
        sitemap_path = os.path.join(self.base_dir, 'sitemap.xml')
        if not os.path.exists(sitemap_path):
            return []

        urls = []
        try:
            tree = ET.parse(sitemap_path)
            root = tree.getroot()
            namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            
            for url_elem in root.findall('.//ns:url/ns:loc', namespace):
                url = url_elem.text
                if self.should_analyze_url(url):
                    urls.append(url)
        except Exception as e:
            print(f"Error parsing sitemap: {e}")
        
        return urls

    async def analyze_directory(self):
        try:
            urls = self.get_urls_from_sitemap()
            print(f"Found {len(urls)} URLs to analyze")

            for url in urls:
                try:
                    self.browser.get(url)
                    time.sleep(1)
                    keywords = self.extract_main_keywords_from_page()
                    
                    for keyword in keywords:
                        if keyword not in self.results:
                            print(f"Analyzing keyword from {url}: {keyword}")
                            self.results[keyword] = await self.search_google(keyword)
                            
                except Exception as e:
                    print(f"Error analyzing {url}: {e}")

            # Save results
            output_file = os.path.join(self.base_dir, 'scripts', 'serp_analysis.json')
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(
                    {
                        'analysis_date': time.strftime('%Y-%m-%d'),
                        'keywords': self.results
                    }, 
                    f, 
                    indent=2, 
                    ensure_ascii=False
                )
                
            print(f"Analysis complete. Results saved to {output_file}")
            
        except Exception as e:
            print(f"Error in analysis: {str(e)}")
        finally:
            self.browser.quit()

    def extract_main_keywords_from_page(self):
        soup = BeautifulSoup(self.browser.html, 'html.parser')
        title = soup.title.string if soup.title else ''
        h1 = soup.h1.string if soup.h1 else ''
        meta_keywords = soup.find('meta', {'name': 'keywords'})
        keywords = meta_keywords['content'].split(',') if meta_keywords else []
        
        all_keywords = [title, h1] + keywords
        return [k.strip() for k in all_keywords if k and len(k.strip()) > 0]

    async def search_google(self, keyword):
        try:
            # Search for regular results
            url = f"https://www.google.com/search?q={keyword}"
            self.browser.get(url)
            time.sleep(2)  # Respect rate limits
            
            serp_results = []
            results = self.browser.eles('tag:div[class~=g]')[:10]
            for result in results:
                link = result.ele('tag:a', timeout=0)
                if link:
                    serp_results.append(link.link)
            
            # Search for allintitle count
            url = f"https://www.google.com/search?q=allintitle:{keyword}"
            self.browser.get(url)
            time.sleep(2)
            
            stats = self.browser.ele('id:result-stats', timeout=0)
            competition_count = '0'
            if stats:
                text = stats.text
                competition_count = ''.join(filter(str.isdigit, text))
            
            return {
                'serp_urls': serp_results,
                'competition_count': competition_count
            }
            
        except Exception as e:
            print(f"Error searching for {keyword}: {str(e)}")
            return {
                'serp_urls': [],
                'competition_count': '0'
            }

async def main():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    analyzer = SEOAnalyzer(base_dir)
    await analyzer.analyze_directory()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())