import requests

BASE_URL = "http://127.0.0.1:8000"

print("1. Register")
try:
    r = requests.post(f"{BASE_URL}/register", json={"username": "sys_test_user", "password": "password"})
    print(r.status_code, r.text)
except Exception as e:
    print("Error:", e)

print("2. Login")
try:
    r = requests.post(f"{BASE_URL}/login", json={"username": "sys_test_user", "password": "password"})
    print(r.status_code, r.text)
    token = r.json().get("access_token") if r.status_code == 200 else None
except Exception as e:
    print("Error:", e)
    token = None

if token:
    print("3. Query")
    try:
        r = requests.post(f"{BASE_URL}/query", json={"question": "What is deadlock?"}, headers={"Authorization": f"Bearer {token}"})
        print(r.status_code, r.text)
    except Exception as e:
        print("Error:", e)
        
    print("4. History")
    try:
        r = requests.get(f"{BASE_URL}/user/history", headers={"Authorization": f"Bearer {token}"})
        print(r.status_code, r.text)
    except Exception as e:
        print("Error:", e)
