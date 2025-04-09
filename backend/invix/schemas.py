# File for FastAPI operations and database connection management.
from pydantic import BaseModel
from datetime import datetime
from typing import List


# For Authentication and User Management
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "invitee"


class UserLogin(BaseModel):
    email: str
    password: str


# For Event Management
class Guest(BaseModel):
    name: str
    tags: List[str]


class EventBase(BaseModel):
    name: str
    date: datetime
    location: str
    guests: List[Guest]


# Model for Event Response (for viewing)
class EventResponse(EventBase):
    id: int

    class Config:
        orm_mode = True  # To support SQLAlchemy models directly


class EventCreate(EventBase):
    pass


class EventUpdate(EventBase):
    pass


class EventOut(EventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
