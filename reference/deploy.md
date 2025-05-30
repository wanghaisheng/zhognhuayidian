https://www.jcchouinard.com/google-indexing-api-with-python/


how to get google index service.json

https://github.com/goenning/google-indexing-script/issues/2

Go to IAM & Admin, click on "Service Accounts."

use owner type

Select your service account, click on the "Keys" tab.

Add a new key, choose "Create new key."

Set "Key type" to "JSON" and click "Create."

Download the JSON file prompted by your browser.


base64 service_account.json > service_account.json.base64


save repo secret as SERVICE_ACCOUNT_JSON

add service account email to gsc



![image](https://github.com/user-attachments/assets/f8d6f173-93d8-4cd6-8451-300a9a8e3e66)


![image](https://github.com/user-attachments/assets/7419a12e-bb5d-47dc-b40a-ff1190f496b6)




