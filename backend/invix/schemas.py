# File for FastAPI operations and database connection management.
from datetime import date
from pydantic import BaseModel
from typing import Optional, List, Nonep


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
    email: str = ""

    class Config:
        from_attributes = True


class GuestResponse(BaseModel):
    id: int
    name: str
    tags: str
    email: str
    qr_token: str

    class Config:
        from_attributes = True


class EventBase(BaseModel):
    name: str
    date: date
    time: Optional[str] = None
    location: str
    expected_guests: int
    image_url: Optional[str] = "default_event.jpg"
    guest_list: Optional[List[str]] = []


# Model for Event Response (for viewing)
class EventResponse(EventBase):
    id: int

    class Config:
        from_attributes = True  # To support SQLAlchemy models directly


class EventUpdate(EventBase):
    name: Optional[str] = None
    date: date
    time: Optional[str] = None
    location: Optional[str] = None
    expected_guests: Optional[int] = None
    image_url: Optional[str] = None
    guest_list: Optional[List[str]] = []


class EventCreate(EventBase):
    time: Optional[str] = None
    image_url: Optional[str] = "default_event.jpg"
    guest_list: Optional[List[str]] = []

    class Config:
        from_attributes = True


class EventOut(EventCreate):
    id: int

    class Config:
        from_attributes = True
