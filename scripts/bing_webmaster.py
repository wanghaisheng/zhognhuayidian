import requests
import json
import sys
import os

CONFIG_PATH = "scripts/config.json"
SITE_URL = None
SITEMAP_URL = None
BING_API_KEY = os.environ.get("BING_API_KEY")

if not BING_API_KEY:
    print("BING_API_KEY environment variable not set.")
    sys.exit(1)

try:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)
    SITE_URL = config["baseUrl"]
    SITEMAP_URL = SITE_URL.rstrip("/") + "/sitemap.xml"
except Exception as e:
    print(f"Failed to read config.json: {e}")
    sys.exit(1)

# Add site to Bing Webmaster
add_site_url = f"https://ssl.bing.com/webmaster/api.svc/json/AddSite?apikey={BING_API_KEY}"
add_site_payload = {"siteUrl": SITE_URL}
add_site_resp = requests.post(add_site_url, json=add_site_payload)
print(f"Add Site Response: {add_site_resp.status_code} {add_site_resp.text}")

# Submit sitemap to Bing Webmaster
submit_sitemap_url = f"https://ssl.bing.com/webmaster/api.svc/json/SubmitSiteMap?apikey={BING_API_KEY}"
submit_sitemap_payload = {"siteUrl": SITE_URL, "siteMapUrl": SITEMAP_URL}
submit_sitemap_resp = requests.post(submit_sitemap_url, json=submit_sitemap_payload)
print(f"Submit Sitemap Response: {submit_sitemap_resp.status_code} {submit_sitemap_resp.text}")
