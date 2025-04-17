# File for FastAPI operations and database connection management.
from pydantic import BaseModel
from datetime import date
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


class PublicUser(BaseModel):
    id: int
    name: str
    email: str
    role: str
    plan: str

    class Config:
        from_attributes = True


# For Event Management
class Guest(BaseModel):
    name: str
    tags: str

    class Config:
        from_attributes = True


class EventBase(BaseModel):
    name: str
    date: date
    location: str
    expected_guests: int


# Model for Event Response (for viewing)
class EventResponse(EventBase):
    id: int

    class Config:
        from_attributes = True  # To support SQLAlchemy models directly


class EventUpdate(EventBase):
    pass


class EventCreate(EventBase):

    class Config:
        from_attributes = True


class EventOut(EventCreate):
    id: int

    class Config:
        from_attributes = True
