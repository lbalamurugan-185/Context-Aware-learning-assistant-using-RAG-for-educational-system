import subprocess
import time
import requests
import sys

# Start uvicorn background process using python -m uvicorn
proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--port", "8002"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

time.sleep(4)  # wait for startup

try:
    r = requests.post("http://127.0.0.1:8002/register", json={"username": "sys_test_isolated", "password": "abc"})
    print("Reg:", r.status_code, r.text)
except Exception as e:
    print("Req Error:", e)

proc.terminate()
outs, errs = proc.communicate(timeout=5)

with open("isolated_logs.txt", "w") as f:
    f.write("STDOUT:\n" + outs + "\nSTDERR:\n" + errs)

print("Done. Check isolated_logs.txt")
