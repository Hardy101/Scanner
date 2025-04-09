from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from pydantic import BaseModel


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, unique=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="invitee")
    plan = Column(String, default="basic")


class PublicUser(BaseModel):
    id: int
    name: str
    email: str
    role: str
    plan: str

    class Config:
        from_attributes = True


# Model for Event Table
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(DateTime)
    location = Column(String)

    guests = relationship("Guest", back_populates="event")


# Guest model
class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    tags = Column(String, default="")
    event_id = Column(Integer, ForeignKey("events.id"))

    event = relationship("Event", back_populates="guests")
