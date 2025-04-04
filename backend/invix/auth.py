from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User
from .security import hash_password, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter()


class UserCreate(BaseModel):
    name: str
    email: str 
    password: str
    role: str = "invitee"


class UserLogin(BaseModel):
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

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="invitee",
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.email, "role": db_user.role})
    response = JSONResponse(
        content={"message": "Login successful", "access_token": token}
    )
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=True, samesite="Lax"
    )
    return response
    # return {"access_token": token, "token_type": "bearer"}
