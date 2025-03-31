from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from invix.auth import router as auth_router
from invix.security import verify_token
from invix.models import PublicUser, User as UserModel
from sqlalchemy.orm import Session
from invix.database import get_db
from typing import List

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://invix-mocha.vercel.app",
        "http://localhost:5173/login",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")


@app.get("/protected")
def protected_route(user: UserModel = Depends(verify_token)):
    return {"message": f"Welcome, {user.email}! This is a protected route."}


def check_role(required_role: str):
    def role_dependency(user: UserModel = Depends(verify_token)):
        if user.role != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return role_dependency


@app.get("/admin-only")
def admin_route(user: UserModel = Depends(check_role("admin"))):
    return {"message": "Welcome, Admin! This route is restricted."}


@app.get("/event-manager")
def event_manager_route(user: UserModel = Depends(check_role("event_manager"))):
    return {"message": "Welcome, Event Manager! You can manage events."}


@app.get("/users", response_model=List[PublicUser])
def get_users(db: Session = Depends(get_db)):  # Injects the database session
    users = db.query(UserModel).all()
    return [PublicUser.model_validate(user) for user in users]
    return db.query(UserModel).all()


# http://127.0.0.1:8000/
