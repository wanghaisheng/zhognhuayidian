import requests
from getbrowser import setup_chrome

from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime, timedelta
import time
import re
import os
import logging
from urllib.parse import quote, urlparse, parse_qs
import random
import logging

browser = setup_chrome()

class DomainMonitor:
    def __init__(self, sites_file="game_sites.txt"):
        """
        初始化监控器
        :param sites_file: 包含游戏网站列表的文本文件
        """
        self.sites = self._load_sites()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.setup_logging()

    def setup_logging(self):
        """设置日志"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('game_monitor.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging

    def _load_sites(self, filename='game_sites.txt'):
        """加载网站列表"""
        try:
            if os.getenv('sites') is None or os.getenv('sites')=='':
                
                with open(filename, 'r', encoding='utf-8') as f:
                    sites= [line.strip() for line in f if line.strip()]
            else:
                sites=os.getenv('sites')
                if ',' in sites:
                    sites=sites.split(',')
                else:
                    sites=[sites]
            return sites
        except FileNotFoundError:
            print(f"Sites file {filename} not found!")
            return []
    def build_google_search_url(self, site, time_range, start=0):
        """
        构建Google搜索URL
        :param site: 网站域名
        :param time_range: 时间范围('24h' or '1w')
        :param start: start position for pagination
        :return: 编码后的搜索URL
        """
        base_url = "https://www.google.com/search"
        if time_range == '24h':
            tbs = 'qdr:d'  # 最近24小时
        elif time_range == '1w':
            tbs = 'qdr:w'  # 最近1周
        elif time_range=='1m':
            tbs='qdr:m'
        elif  time_range=='1y':
            tbs='qdr:y'
            
        elif  time_range=='all':
            print("default is all results")
            pass
        
        query = f'site:{site}'
        params = {
            'q': query,
            'tbs': tbs,
            'num': 100,  # 每页结果数
            'start': start
        }
        
        query_string = '&'.join([f'{k}={quote(str(v))}' for k, v in params.items()])
        return f"{base_url}?{query_string}"

    def build_google_advanced_search_url(self, query, time_range, start=0):
        """
        构建Google高级搜索URL
         :param query: Advanced search query including operators
        :param time_range: 时间范围
        :param start: start position for pagination
        :return: 编码后的搜索URL
        """
        base_url = "https://www.google.com/search"
        if time_range == '24h':
            tbs = 'qdr:d'  # 最近24小时
        elif time_range == '1w':
            tbs = 'qdr:w'  # 最近1周
        elif time_range=='1m':
            tbs='qdr:m'
        elif  time_range=='1y':
            tbs='qdr:y'
            
        elif  time_range=='all':
            print("default is all results")
            tbs=None
        params = {
            'q': query,
            'tbs': tbs,
             'num': 100,
            'start': start
        }
        
        query_string = '&'.join([f'{k}={quote(str(v))}' for k, v in params.items()])
        return f"{base_url}?{query_string}"

    def extract_search_results(self, html_content):
        """
        从Google搜索结果页面提取信息
        :param html_content: 页面HTML内容
        :return: 提取的URL和标题列表
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        results = []
        
        # 查找搜索结果
        for result in soup.select('div.g'):
            try:
                title_elem = result.select_one('h3')
                url_elem = result.select_one('a')
                
                if title_elem and url_elem:
                    title = title_elem.get_text()
                    url = url_elem['href']
                    
                    # 提取可能的游戏名称
                    game_name = self.extract_game_name(title)
                    
                    # if game_name:
                    results.append({
                            'title': title,
                            'url': url,
                            'game_name': game_name
                        })
            except Exception as e:
                self.logger.error(f"Error extracting result: {str(e)}")
                
        return results

    def extract_game_name(self, title):
        """
        从标题中提取可能的游戏名称
        :param title: 页面标题
        :return: 提取的游戏名称或None
        """
        # 这里可以根据具体网站的标题特征来优化游戏名称提取规则
        patterns = [
            r'《(.+?)》',  # 中文书名号
            r'"(.+?)"',    # 英文引号
            r'【(.+?)】',  # 中文方括号
            r'\[(.+?)\]'   # 英文方括号
        ]
        
        for pattern in patterns:
            match = re.search(pattern, title)
            if match:
                return match.group(1)
        
        # 如果没有特定标记，返回清理后的标题
        cleaned_title = re.sub(r'(攻略|评测|资讯|下载|官网|专区|合集|手游|网游|页游|主机游戏|单机游戏)', '', title)
        return cleaned_title.strip()

    def monitor_site(self, site, time_range, max_pages=100,advanced_query=None):
        """
        监控单个网站，考虑分页
        :param site: 网站域名
        :param time_range: 时间范围
        :param max_pages: 最大页数
        :param advanced_query: advanced search query to use with the build_google_advanced_search_url if set, or else uses the default
        :return: 搜索结果列表
        
        Monitor a site for search results over multiple pages.
        :param site: The domain of the site to monitor.
        :param time_range: The time range to filter the search results.
        :param max_pages: The maximum number of pages to fetch.
        :param advanced_query: Optional advanced search query.
        :return: A list of search results.
        """
        all_results = []
        total_pages = max_pages  # Default to max_pages if result count cannot be determined

        for page in range(max_pages):
            start = page * 100  # Google default 100 results per page
            if advanced_query:
                search_url = self.build_google_advanced_search_url(advanced_query, time_range, start)
                self.logger.info(f"Monitoring advance url {search_url} for {time_range}, page {page+1}")
                
            else:
                search_url = self.build_google_search_url(site, time_range, start)
                self.logger.info(f"Monitoring nomal url {search_url} for {time_range}, page {page+1}")

            self.logger.info(f"Monitoring {site} for {time_range}, page {page + 1}")

            try:
                tab=browser.new_tab()
                
                tab.get(search_url)              
                html=tab.html
                if page == 0:  # Extract total result count only on the first page
                    soup = BeautifulSoup(html, 'html.parser')
                    result_stats = soup.select_one('#result-stats')
                    print('result_stats=',result_stats)
                    if result_stats:
                        match = re.search(r'About ([\d,]+) results', result_stats.text)
                        if match:
                            total_results = int(match.group(1).replace(',', ''))
                            total_pages = min(max_pages, (total_results // 100) + 1)
                            self.logger.info(f"Total results: {total_results}, Total pages: {total_pages}")

                results = self.extract_search_results(html)
                if not results:  # If no results are found for a page, assume there are no more pages
                    self.logger.info(f"No more results found for {site} on page {page + 1}")
                    break

                all_results.extend(results)
                self.logger.info(f"Found {len(results)} results for {site} on page {page + 1}")

                # Random delay to avoid requests being too fast
                time.sleep(random.uniform(2, 5))

                if page + 1 >= total_pages:
                    self.logger.info(f"Reached the last page based on total results for {site}")
                    break

            except requests.exceptions.RequestException as e:
                self.logger.error(f"Error fetching page {page + 1} for {site}: {str(e)}")
                break  # If a page cannot be fetched, then break
            except Exception as e:
                self.logger.error(f"Error processing page {page + 1} for {site}: {str(e)}")
                break  # If there are any other exceptions when processing the results, then break

        return all_results
    
    def monitor_all_sites(self, time_ranges=None, advanced_queries=None):
        """
        监控所有网站
        :param time_ranges: 时间范围列表
         :param advanced_queries: Dictionary of site to advanced_query, if a site has no entry, then the default search will be used
        :return: 包含所有结果的DataFrame
        """
        if time_ranges is None:
            time_ranges = ['all']
            
        all_results = []
        if len(self.sites)==0:
            print('please provide sites')
            # return 
        for site in self.sites:
            for time_range in time_ranges:
                 advanced_query = advanced_queries.get(site) if advanced_queries else None
                 results = self.monitor_site(site, time_range, advanced_query=advanced_query)  # re-use monitor_site
                 for result in results:
                    result.update({
                        'site': site,
                        'time_range': time_range,
                        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    })
                 all_results.extend(results)
        
        # 转换为DataFrame并保存
        if all_results:
            df = pd.DataFrame(all_results)
            output_file = f'game_monitor_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
            df.to_csv(output_file, index=False, encoding='utf-8-sig')
            self.logger.info(f"Results saved to {output_file}")
            return df
        else:
            self.logger.warning("No results found")
            return pd.DataFrame()

def main():
    """主函数"""
    # 创建监控器实例
    monitor = DomainMonitor()
    expression=os.getenv('expression','intitle:"sprunki"')
    if expression =='':
        return
    expression=expression.strip()
    sites=[
      'apps.apple.com',
      'play.google.com'
    ]
    advanced_queries = {
        'apps.apple.com': f'{expression} site:apps.apple.com',
        'play.google.com': f'{expression} site:play.google.com'
    }
    
    # 开始监控
    results_df = monitor.monitor_all_sites(advanced_queries=advanced_queries)
    os.mkdirs('result',exist_ok=True)
    results_df.to_csv('result/report.csv')
    # 输出统计信息
    if not results_df.empty:
        print("\n=== 监控统计 ===")
        print(f"总计发现新页面: {len(results_df)}")
        print("\n按网站统计:")
        print(results_df['site'].value_counts())
        print("\n按时间范围统计:")
        print(results_df['time_range'].value_counts())

if __name__ == "__main__":
    main()
