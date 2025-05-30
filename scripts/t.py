from CloudflareBypasser import CloudflareBypasser
from DrissionPage import ChromiumPage

driver = ChromiumPage()
driver.get('https://nopecha.com/demo/cloudflare')

cf_bypasser = CloudflareBypasser(driver)
cf_bypasser.bypass()
