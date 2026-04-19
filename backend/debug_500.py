import urllib.request
import json

url = "http://127.0.0.1:8000/register"
data = json.dumps({"username": "fastapi_test_new", "password": "abc"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as f:
        print("Success:", f.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Failed with:", e.code)
    print("Error body:", e.read().decode('utf-8'))
