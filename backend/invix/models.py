from sqlalchemy import Column, Integer, String, Date, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .database import Base
from pydantic import BaseModel


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, unique=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="invitee")
    plan = Column(String, default="basic")


# Model for Event Table
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    date = Column(Date, nullable=False)
    location = Column(String, default="not set")
    expected_guests = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id"))
    guests = relationship("Guest", back_populates="event")


# Guest model
class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    tags = Column(String, default="")
    event_id = Column(Integer, ForeignKey("events.id"))
    event = relationship("Event", back_populates="guests")

    def __repr__(self):
        return f"<Guest(id={self.id}, name={self.name}, tags={self.tags})>"

