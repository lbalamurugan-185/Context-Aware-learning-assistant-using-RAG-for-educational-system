import traceback
from sqlalchemy.orm import Session
from database import get_db, SessionLocal
from main import register_user, UserCreate
import auth
import models

def test_manual():
    db = SessionLocal()
    try:
        user = UserCreate(username="direct_db_test_1", password="abc")
        register_user(user, db)
        print("Registration successful!")
    except Exception as e:
        print("Registration failed Exception:")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_manual()
