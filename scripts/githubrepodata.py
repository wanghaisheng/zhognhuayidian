import os
from domainMonitorDp import DomainMonitor

monitor = DomainMonitor()


expression = os.getenv('expression', 'intext:"saas kit"')
sites = ['twitter.com', 'youtube.com']
monitor.sites=sites
advanced_queries = {}
for s in sites:
    advanced_queries[s] = f'{expression} site:{s}'
print('==',advanced_queries)

results_df = monitor.monitor_all_sites(time_ranges=None,advanced_queries=advanced_queries)
os.makedirs('result', exist_ok=True)
results_df.to_csv('result/report.csv')
if not results_df.empty:
    print("\n=== 监控统计 ===")
    print(f"总计发现新页面: {len(results_df)}")
    print(results_df['site'].value_counts())
