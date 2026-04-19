from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("Testing Registration")
response = client.post("/register", json={"username": "sys_test_user_3", "password": "password"})
print("Status:", response.status_code)
print("Response:", response.text)

print("Testing Login")
response = client.post("/login", json={"username": "sys_test_user_3", "password": "password"})
print("Status:", response.status_code)
print("Response:", response.text)
if response.status_code == 200:
    token = response.json()["access_token"]
    print("Testing Query")
    
    # Optional testing history logic
    response_q = client.post("/query", json={"question": "What is OS", "answer_type": "short"}, headers={"Authorization": f"Bearer {token}"})
    print("Query Response:", response_q.status_code)
    try:
        print(response_q.text[:200])
    except:
        pass
        
    print("Testing History")
    response_h = client.get("/user/history", headers={"Authorization": f"Bearer {token}"})
    print("History Response:", response_h.status_code)
    try:
        print(response_h.text[:200])
    except:
        pass
