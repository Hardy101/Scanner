from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from security import verify_token
from models import PublicUser, User as UserModel
from sqlalchemy.orm import Session
from database import get_db
from typing import List

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://invix-mocha.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")


@app.get("/users", response_model=List[PublicUser])
def get_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    return [PublicUser.model_validate(user) for user in users]
    return db.query(UserModel).all()


# http://127.0.0.1:8000/
