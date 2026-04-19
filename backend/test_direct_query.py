from main import query, QueryRequest
from database import SessionLocal
import models

def test_direct():
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.username == "sys_test_x").first()
    
    if not user:
        print("User not found")
        return
        
    req = QueryRequest(question="What is OS", answer_type="short")
    try:
        res = query(req, db, user)
        print("Success:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_direct()
