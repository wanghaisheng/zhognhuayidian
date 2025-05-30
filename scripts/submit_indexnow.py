import xml.etree.ElementTree as ET
import requests
import os
import sys

SITEMAP = sys.argv[1] if len(sys.argv) > 1 else "sitemap.xml"
INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY")
ENDPOINT = "https://api.indexnow.org/indexnow"

if not INDEXNOW_KEY:
    print("INDEXNOW_KEY environment variable not set.")
    sys.exit(1)

try:
    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    urls = [url.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text for url in root.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url')]
except Exception as e:
    print(f"Failed to parse {SITEMAP}: {e}")
    sys.exit(1)

for url in urls:
    payload = {
        "host": url.split("/")[2],
        "key": INDEXNOW_KEY,
        "urlList": [url]
    }
    try:
        response = requests.post(ENDPOINT, json=payload)
        print(f"Submitted {url}: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Failed to submit {url}: {e}")
