#!/usr/bin/env python
# MassRDAP - developed by acidvegas (https://git.acid.vegas/massrdap)

import asyncio
import logging
import json
import re
import os, random
from datetime import datetime

import pandas as pd
from DataRecorder import Recorder
import time
# try:
#     import aiofiles
# except ImportError:
#     raise ImportError('missing required aiofiles library (pip install aiofiles)')

try:
    import aiohttp
except ImportError:
    raise ImportError("missing required aiohttp library (pip install aiohttp)")
import aiohttp
import asyncio
from contextlib import asynccontextmanager
# Usage
# Now you can use db_manager.add_screenshot(), db_manager.read_screenshot_by_url(), etc.
from loguru import logger
import threading

# Replace this with your actual test URL
test_url = "http://example.com"

# Replace this with your actual outfile object and method for adding data
# outfile = YourOutfileClass()
# Color codes
BLUE = "\033[1;34m"
CYAN = "\033[1;36m"
GREEN = "\033[1;32m"
GREY = "\033[1;90m"
PINK = "\033[1;95m"
PURPLE = "\033[0;35m"
RED = "\033[1;31m"
YELLOW = "\033[1;33m"
RESET = "\033[0m"

MAX_RETRIES = 3
INITIAL_DELAY = 1
MAX_DELAY = 10

# Setup basic logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Global variable to store RDAP servers
RDAP_SERVERS = {}
semaphore = threading.Semaphore(5)  # Allow up to 5 concurrent tasks


def get_title_from_html(html):
    title = "not content!"
    try:
        title_patten = r"<title>(\s*?.*?\s*?)</title>"
        result = re.findall(title_patten, html)
        if len(result) >= 1:
            title = result[0]
            title = title.strip()
    except:
        logger.error("cannot find title")
    return title



async def fetch_rdap_servers():
    """Fetches RDAP servers from IANA's RDAP Bootstrap file."""

    async with aiohttp.ClientSession() as session:
        async with session.get("https://data.iana.org/rdap/dns.json") as response:
            data = await response.json()
            for entry in data["services"]:
                tlds = entry[0]
                rdap_url = entry[1][0]
                for tld in tlds:
                    RDAP_SERVERS[tld] = rdap_url

def get_proxy():
    proxy=None
    with aiohttp.ClientSession() as session:
        try:
            with session.get('http://demo.spiderpy.cn/get') as response:
                data =  response.json()
                proxy=data['proxy']
                return proxy
        except:
            pass
def get_proxy_proxypool():
    with aiohttp.ClientSession() as session:

        if proxy is None:
            try:
                with session.get('https://proxypool.scrape.center/random') as response:
                    proxy =  response.text()
                    return proxy
            except:
                return None

def get_tld(domain: str):
    """Extracts the top-level domain from a domain name."""
    parts = domain.split(".")
    return ".".join(parts[1:]) if len(parts) > 1 else parts[0]


def submit_radar_with_retry(
        browser,
    domain: str,
    url:str,
    valid_proxies: list,
    proxy_url: str,
    outfile: Recorder,
):
    retry_count = 0
    while retry_count < MAX_RETRIES:
        if retry_count>0:
            pro_str=None
            proxy_url=None
            if valid_proxies:
                proxy_url=random.choice(valid_proxies)
            else:
                try:
                    pro_str= get_proxy()

                    if pro_str is None:
                    
                        pro_str= get_proxy_proxypool()


                except Exception as e:
                    logger.error('get proxy error:{} use backup',e)
            if pro_str:
                proxy_url = "http://{}".format(pro_str)            
    
        logger.info("current proxy{}", proxy_url)

        try:
            result =      submit_radar(browser,domain,url, proxy_url, outfile)
                
            if result:
                if proxy_url and proxy_url not in valid_proxies:
                    valid_proxies.append(proxy_url)
                return result
        except asyncio.TimeoutError:
            logger.error(
                f"Timeout occurred for domain: {domain} with proxy: {proxy_url}"
            )
        except Exception as e:
            logger.error(f"Error occurred: {e}")
        retry_count += 1
        # if retry_count < MAX_RETRIES:
        #     delay = min(INITIAL_DELAY * (2 ** retry_count), MAX_DELAY)
        #     logger.info(f"Retrying in {delay} seconds with proxy {proxy_url}...")
        #     await asyncio.sleep(delay)

    logger.error(f"Max retries reached for domain: {domain}")
    return None
import uuid

def is_valid_uuid(uuid_to_test, version=4):
    try:
        # This will check if the UUID is valid and raise a ValueError if not
        val = uuid.UUID(uuid_to_test, version=version)
        return str(val) == uuid_to_test
    except ValueError:
        # The UUID is not valid
        return False



def submit_radar(browser,
    domain: str, url:str,proxy_url: str, outfile: Recorder
):
    """
    Looks up a domain using the RDAP protocol.

    :param domain: The domain to look up.
    :param proxy_url: The proxy URL to use for the request.
    :param semaphore: The semaphore to use for concurrency limiting.
    """

    tab=browser.driver.new_tab()

    page = browser.driver.get_tab(tab)



    query_url='https://radar.cloudflare.com/scan'
    

    logger.info("use proxy_url:{}", proxy_url)

    logger.info("querying:{}", query_url)
    try:
        headless
    except:
        headless=True
        
    try:

        # from DPhelper import DPHelper 

        # page=None
        # browser=None
        # if os.path.exists(cookiepath):

        #     if proxy_url:
        #         browser=DPHelper(browser_path=None,HEADLESS=True,proxy_server=f'http://{proxy_url}')
                    
        #     else:
        #         browser=DPHelper(browser_path=None,HEADLESS=True)
        #     browser.loadCookie(cookiepath)
        #     page=browser.driver

        # else:            
        #     if proxy_url:
        #         browser=DPHelper(browser_path=None,HEADLESS=False,proxy_server=f'https://{proxy_url}')
                    
        #     else:
        #         browser=DPHelper(browser_path=None,HEADLESS=False)
        #     page=browser.driver

        page.get(query_url)    


        page.wait.load_start()
        page.ele('@name=url').click()
        page.ele('@name=url').input(domain)
        page.ele('@type=submit').click()

        page.wait.load_start()
        uuid=page.url

        print('=====',uuid)
        waitdone=False
        if waitdone:

            time.sleep(30)
            if 'summary' in uuid:
                uuid=uuid.split('/')[-2]
        else:
            if '-' in uuid:
                uuid=uuid.split('https://radar.cloudflare.com/scan/')[-1]
        if is_valid_uuid(uuid):
            # browser.saveCookie(cookiepath)

            data = {
                "domain": domain,
                'uuid':uuid
            }
            outfile.add_data(data)
            # Domain=
            # new_domain = db_manager.Screenshot(
                # url=domain,
            # uuid=uuid)
            # db_manager.add_screenshot(new_domain)


            logger.info(
                f"{GREEN}SUCCESS {GREY}| {BLUE}{uuid} {GREY}| {PURPLE}{query_url.ljust(50)} {GREY}| {CYAN}{domain}{GREEN}"
            )
            return True
        else:
            logger.warning(f"Non-valid uuid: {uuid} for {domain}")
            return False

    except asyncio.TimeoutError as e:
        logger.info(
            f"{RED} TimeoutError {GREY}| --- | {PURPLE}{query_url.ljust(50)} {GREY}| {CYAN}{domain} {RED}| {e}{RESET}"
        )
        raise

    except aiohttp.ClientError as e:
        logger.info(
            f"{RED} ClientError {GREY}| --- | {PURPLE}{query_url.ljust(50)} {GREY}| {CYAN}{domain} {RED}| {e}{RESET}"
        )
        raise

    except Exception as e:
        # page.quit()
        # 需要注意的是，程序结束时浏览器不会自动关闭，下次运行会继续接管该浏览器。

# 无头浏览器因为看不见很容易被忽视。可在程序结尾用page.quit()将其关闭 不 quit 还是会无头模式
        # headless=False
        print('start a new browser to get fresh cookie')
        # newbrowser=None
        # if proxy_url:
        #     newbrowser=DPHelper(browser_path=None,HEADLESS=False,proxy_server=f'http://{proxy_url}')
                
        # else:
        #     newbrowser=DPHelper(browser_path=None,HEADLESS=False)
        # cookie=newbrowser.bypass(query_url)
        # page=newbrowser.driver                                    
        # page.get(query_url)                
        # newbrowser.saveCookie(cookiepath,cookie)
        # with open('error.html','w',encoding='utf8') as f:
        #     f.write(page.html)

        logger.info(
            f"{RED}Exception  {GREY}| --- | {PURPLE}{query_url.ljust(50)} {GREY}| {CYAN}{domain} {RED}| {e}{RESET}"
        )
        raise

    finally:
        if page:
            page.close()
        print('finally')

@asynccontextmanager
async def aiohttp_session(url):
    async with aiohttp.ClientSession() as session:
        yield session


async def test_proxy(test_url, proxy_url):
    try:
        async with aiohttp_session(test_url) as session:
            # Determine the type of proxy and prepare the appropriate proxy header

            # Make the request
            async with session.get(test_url, timeout=10, proxy=proxy_url) as response:
                if uuid == 200:

                    # outfile.add_data(proxy_url)  # Uncomment and replace with your actual implementation
                    return True
                else:

                    return False
    except asyncio.TimeoutError:
        # print(f"{Style.BRIGHT}{Color.red}Invalid Proxy (Timeout) | {proxy_url}{Style.RESET_ALL}")
        return False
    except aiohttp.ClientError:

        return False


# To run the async function, you would do the following in your main code or script:
# asyncio.run(test_proxy('your_proxy_url_here'))
def cleandomain(domain):
    domain=domain.strip()
    if "https://" in domain:
        domain = domain.replace("https://", "")
    if "http://" in domain:
        domain = domain.replace("http://", "")
    if "www." in domain:
        domain = domain.replace("www.", "")
    if domain.endswith("/"):
        domain = domain.rstrip("/")
    return domain
# 请求的URL，注意对URL参数进行URL编码

async def fetch_cloudflare_radar_data(domain):
    url = f'https://radar.cloudflare.com/api/search?query={domain}'

    # 请求头，包括站点策略
    headers = {
        'Referer': f'https://radar.cloudflare.com/api/search?query={domain}',
        'Report-To': 'same-origin'  ,# 引用站点策略,
        'Content-type':"application/x-www-form-urlencoded;charset=UTF-8",
            'Cookie':"__cf_logged_in=1; CF_VERIFIED_DEVICE_5de93330ab60f42754eeebf5f63f2ed983f6a0280ef2651ec33eaa69e0c64434=1719217177; cf_clearance=BSt1r2ugBL3jAsqKe2ArIOM1uTdGPjCSulEiL6FIymw-1719553423-1.0.1.1-xjyDRT0HXbN.gEhhRL1HcBwqjUBpHodqxKTWd6V.uucfC.kGCIl_2dRGkyozA1978ncgllW5IN4QJqIMKe0E.A; cfzs_google-analytics_v4=%7B%22nzcr_pageviewCounter%22%3A%7B%22v%22%3A%221%22%7D%7D; _mkto_trk=id:713-XSC-918&token:_mch-cloudflare.com-1719555178948-38291; _gcl_au=1.1.559844338.1719555181; _biz_uid=77e43d4cd5a24350a064b4cf9a8982f4; _biz_nA=2; _biz_pendingA=%5B%5D; _biz_flagsA=%7B%22Version%22%3A1%2C%22Mkto%22%3A%221%22%2C%22XDomain%22%3A%221%22%2C%22ViewThrough%22%3A%221%22%7D; __cf_bm=34IWY2xq6koB_TWGABGf8e9wxaBA3LV9NnfhpJeRXyE-1719556522-1.0.1.1-6mB2f5V.Dr4ftLIi1z3tvmTFgjvCkLU8bEgc3giHP1_z5jD4BkoXFcG_otZruJ5b3zIuavMYv1jG6dbWgCrkgg; cfz_google-analytics_v4=%7B%22nzcr_engagementDuration%22%3A%7B%22v%22%3A%220%22%2C%22e%22%3A1751092626809%7D%2C%22nzcr_engagementStart%22%3A%7B%22v%22%3A%221719556626809%22%2C%22e%22%3A1751092626809%7D%2C%22nzcr_counter%22%3A%7B%22v%22%3A%226%22%2C%22e%22%3A1751092626809%7D%2C%22nzcr_ga4sid%22%3A%7B%22v%22%3A%22337350929%22%2C%22e%22%3A1719558426809%7D%2C%22nzcr_session_counter%22%3A%7B%22v%22%3A%221%22%2C%22e%22%3A1751092626809%7D%2C%22nzcr_ga4%22%3A%7B%22v%22%3A%2256a89d4c-0d20-452b-b476-f03719036d2d%22%2C%22e%22%3A1751092626809%7D%2C%22nzcr__z_ga_audiences%22%3A%7B%22v%22%3A%2256a89d4c-0d20-452b-b476-f03719036d2d%22%2C%22e%22%3A1751091172967%7D%2C%22nzcr_let%22%3A%7B%22v%22%3A%221719556626809%22%2C%22e%22%3A1751092626809%7D%7D"
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            # 确保请求成功
            if response.status == 200:
                # 解析JSON格式的响应数据
                response_data = await response.json()
                print("Response Data:", json.dumps(response_data, indent=2))
                return True
            else:
                print(f"Failed to get 200 OK status code, status code: {response.status}")
                return False

def process_domains_screensht(domains, outfile,counts):
        from getbrowser  import  setup_chrome
    
        browser = setup_chrome()

        concurrency=5

        tasks = []
        domains = list(set(domains))
        if counts!=0:
            domains=domains[:counts]
        for domain in domains:
            domain=cleandomain(domain)

            if (
                domain
                and domain not in donedomains
                and type(domain) == str
                and "." in domain
                and len(domain.split(".")) > 1
            ):
                print(domain)

                proxy = None

                # if len(valid_proxies)>1:
                #     proxy=random.choice(valid_proxies)
                #     print('pick proxy',proxy)

                # proxy = "socks5h://127.0.0.1:1080"
                tld = get_tld(domain)

                if tld:

                    try:

                        task = threading.Thread(target=submit_radar_with_retry, args=(browser, domain,url,[], proxy,outfile))

                        tasks.append(task)
                        task.start()

                        if len(tasks) >= concurrency:
                            # Wait for the current batch of tasks to complete
                            for task in tasks:
                                task.join()

                                tasks = []
                    except Exception as e:
                        print(f"{RED}An error occurred while processing {domain}: {e}")
        for task in tasks:
            task.join()
