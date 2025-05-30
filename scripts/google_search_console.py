import json
import os
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

CONFIG_PATH = "scripts/config.json"
SCOPES = ["https://www.googleapis.com/auth/webmasters"]
SERVICE_ACCOUNT_FILE = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

if not SERVICE_ACCOUNT_FILE or not os.path.exists(SERVICE_ACCOUNT_FILE):
    print("Google service account credentials file not found. Set GOOGLE_APPLICATION_CREDENTIALS environment variable.")
    sys.exit(1)

try:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)
    SITE_URL = config["baseUrl"].rstrip("/") + "/"
    SITEMAP_URL = SITE_URL + "sitemap.xml"
except Exception as e:
    print(f"Failed to read config.json: {e}")
    sys.exit(1)

try:
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('searchconsole', 'v1', credentials=credentials)
except Exception as e:
    print(f"Failed to authenticate to Google Search Console API: {e}")
    sys.exit(1)

# Add site to Search Console (will not verify, just attempt to add)
try:
    site_add = service.sites().add(siteUrl=SITE_URL).execute()
    print(f"Add Site Response: {site_add}")
except Exception as e:
    print(f"Failed to add site: {e}")

# Submit sitemap
try:
    sitemap_submit = service.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
    print(f"Submit Sitemap Response: {sitemap_submit}")
except Exception as e:
    print(f"Failed to submit sitemap: {e}")
