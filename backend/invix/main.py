from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import auth, event
from models import User as UserModel
from schemas import PublicUser
from database import get_db, init_db
from sqlalchemy.orm import Session
from typing import List
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.title = "Invix API"
app.description = "API for Invix, a guest management system."

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logging.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


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

app.include_router(auth.router, prefix="/auth")
app.include_router(event.router, prefix="/event")


@app.get("/users", response_model=List[PublicUser])
def get_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    return [PublicUser.model_validate(user) for user in users]
