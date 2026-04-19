import subprocess
import time
import requests

proc = subprocess.Popen(["uvicorn", "main:app", "--port", "8001"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
time.sleep(3)  # wait for startup

try:
    r = requests.post("http://127.0.0.1:8001/register", json={"username": "sys_test_2", "password": "abc"})
    print("Reg:", r.status_code, r.text)
    
    r2 = requests.post("http://127.0.0.1:8001/query", json={"question": "What is OS", "answer_type": "short"})
    print("Query:", r2.status_code, r2.text)
except Exception as e:
    print("Req Error:", e)

proc.terminate()
outs, errs = proc.communicate(timeout=5)
with open("test_logs.txt", "w") as f:
    f.write("STDOUT:\n" + outs + "\nSTDERR:\n" + errs)
