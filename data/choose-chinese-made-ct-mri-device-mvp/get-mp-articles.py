# https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baiduadv&wd=%E5%9B%BD%E4%BA%A7ct%20site%3Amp.weixin.qq.com&oq=%E5%9B%BD%E4%BA%A7ct%20site%3Amp.weixin.qq.com&rsv_pq=e88db4ce00cd887e&rsv_t=256b4D2yo2fBNTqKe7E3IhSD4s4sO14u68eLuvCndtsP00QR1%2Br2andmZKJ69F0&rqlang=cn&rsv_enter=1&rsv_dl=tb&gpc=stf%3D1736852798%2C1737457598%7Cstftype%3D1&tfflag=1&si=mp.weixin.qq.com&ct=2097152from getbrowser import setup_chrome
# https://weixin.sogou.com/weixin?query=%E5%9B%BD%E4%BA%A7ct&_sug_type_=&sut=4315&lkt=1%2C1737143307246%2C1737143307246&s_from=input&_sug_=y&type=2&sst0=1737143307348&page=10&ie=utf8&w=01019900&dr=1
#搜狗不登录显示10条 总共1000条  放弃

import pandas as pd
import json
import time
import argparse
import os
import urllib.parse

browser = setup_chrome()

def getlinks(k,timeframe='7days',position='all',site='mp.weixin.qq.com'):
    urls =[ ]
    baseurl='https://www.baidu.com/?tn=68018901_16_pg'
    site='mp.weixin.qq.com'
    # input
    tab=browser.new_tab()
    tab.get(url)
    tab.ele('.c-input adv-q-input switch-input').clear().input(k)
    if timeframe =='all':
        pass
    elif timeframe=='1days':
        
    elif timeframe=='7days':
        
        tab.ele('.c-select-dropdown-list').click()
    elif timeframe=='30days':
        tab.ele('.c-select-dropdown-list').click()
        
    elif timeframe=='365days':
        tab.ele('.c-select-dropdown-list').click()

    all_links = []
    for url in urls:
        tab = browser.new_tab()
        tab.get(url)
        time.sleep(2)  # Allow time for page to load

        # Get the total number of records and calculate the number of pages
        try:
            c = tab.ele('.list_right_mid').text
            print('==', c)
            c = c.split('记录')[-1].split('条')[0]
            pagecount = int(int(c) / 20) + 1
        except:
            continue

        items = []
        pagecount=25
        # for p in range(1, pagecount + 1):
        while thereipagination:
            tab.ele('text:下一页 >').click()
            time.sleep(3)
            
            try:
                uls = tab.eles('.result c-container xpath-log new-pmd')
                # print('00000',t.text)
                # ulrs=t.children()
                # print('111',urls.text)
                # return 
                for index,e in enumerate(uls):
                    print('====page=',p,index,e,e.text)
                    link = e.ele("t:h3").ele("t:a").link
                    title = e.ele("t:h3").ele("t:a").text
                    dese=e.ele('.c-title t t tts-title').next(2)
                    date=dese.ele('.c-color-gray2').text
                    des=dese.ele('.content-right_1THTn').text                
                    item={
                        "keyword":k,
                        "url":link,
                        "title":title,
                        "":,
                         }
                    items.append(item)
            except Exception as e:
                print(f"Error on page {p}: {e}")

        all_links.extend(links)
        tab.close()

    return all_links

def getdetail(link):
    tab = browser.new_tab()
    tab.get(link)
    time.sleep(2)

    try:
        img = tab.ele('.article_main').ele("t:img").link
    except:
        img = ''
    try:
        content = tab.ele('.article_main').text
    except:
        content = ''
    try:
        name = tab.ele('#article_title').text.replace("《", '').replace("》", '')
    except:
        name = ''
    result = {
        "link": link,
        "img": img,
        "name": name,
        "content": content
    }
    tab.close()
    return result

def save_data(data, output_format, filename):
    if output_format == 'csv':
        df = pd.DataFrame(data)
        df.to_csv(filename, index=False)
        print(f"Data saved to {filename} (CSV format)")
    elif output_format == 'json':
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Data saved to {filename} (JSON format)")
    else:
        print("Invalid output format. Supported formats are 'csv' and 'json'.")

# Main execution
if __name__ == "__main__":
    # Get configuration from environment variables
    output_format = os.getenv('OUTPUT_FORMAT', 'json').lower()  # Default: csv
    output_filename = os.getenv('OUTPUT_FILENAME', 'data')  # Default: data

    # You can still override with command-line arguments if needed
    parser = argparse.ArgumentParser(description="Scrape data from sxlib.org.cn and save it as CSV or JSON.")
    parser.add_argument("-f", "--format", choices=['csv', 'json'],
                        help="Override OUTPUT_FORMAT environment variable")
    parser.add_argument("-o", "--output",
                        help="Override OUTPUT_FILENAME environment variable")
    args = parser.parse_args()

    if args.format:
        output_format = args.format
    if args.output:
        output_filename = args.output
    keywords=['国产ct','国产mri']
        
    for k in keywords:

        all_links = getlinks(k)
    print(f"Found {len(all_links)} links.")
    
    results = []
    for link in all_links:
        try:
            detail = getdetail(link)
            results.append(detail)
        except Exception as e:
            print(f"Error processing link {link}: {e}")

    save_data(results, output_format, output_filename + '.' + output_format)

    browser.quit()
