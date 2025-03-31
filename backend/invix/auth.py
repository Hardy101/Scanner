from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from invix.database import SessionLocal
from invix.models import User
from invix.security import hash_password, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "invitee"

class UserLogin(BaseModel):
    name: str
    email: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if user.role not in ["admin", "event_manager", "invitee"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    new_user = User(name=user.name, email=user.email, hashed_password=hash_password(user.password), role='invitee')
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}
