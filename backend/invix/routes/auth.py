from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from schemas import PublicUser, UserCreate, UserLogin
from security import (
    hash_password,
    verify_password,
    create_access_token,
)
from variables import EXPIRY_DATE
from operations.functions import fetch_current_user

router = APIRouter(tags=["Auth"])


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
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=EXPIRY_DATE,
    )
    return response


@router.get("/me", response_model=PublicUser)
def get_current_user(current_user: User = Depends(fetch_current_user)):
    return PublicUser.model_validate(current_user, from_attributes=True)


@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(
        key="access_token", httponly=True, secure=True, samesite="None"
    )
    return response


@router.get("/user", response_model=PublicUser)
def get_user(user: User = Depends(get_current_user)):
    return PublicUser.model_validate(user)
