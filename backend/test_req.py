import requests

BASE_URL = "http://127.0.0.1:8000"

print("1. Login")
try:
    requests.post(f"{BASE_URL}/register", json={"username": "sys_test_x", "password": "abc"})
    r = requests.post(f"{BASE_URL}/login", json={"username": "sys_test_x", "password": "abc"})
    print(r.status_code, r.text)
    token = r.json().get("access_token") if r.status_code == 200 else None
except Exception as e:
    print("Error:", e)
    token = None

if token:
    print("2. Query")
    try:
        r = requests.post(f"{BASE_URL}/query", json={"question": "What is OS"}, headers={"Authorization": f"Bearer {token}"})
        print("Query:", r.status_code)
        print(r.text[:500])
    except Exception as e:
        print("Error:", e)
