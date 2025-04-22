from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from models import User
from database import SessionLocal
from variables import ALGORITHM, SECRET_KEY
from jose import JWTError, jwt


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_event(db: Session, event: schemas.EventCreate, user_id: int):
    db_event = models.Event(
        name=event.name,
        date=event.date,
        location=event.location,
        expected_guests=event.expected_guests,
        created_by=user_id,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_events(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Event).offset(skip).limit(limit).all()


def add_guests_to_event(db: Session, event_id: int, guests: List[schemas.Guest]):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Add each guest to the event
    for guest in guests:
        db_guest = models.Guest(
            name=guest.name,
            tags=guest.tags,
            event_id=db_event.id,
        )
        db.add(db_guest)

    db.commit()
    return db_event  # Return the updated event (with guests now associated)


# Fetches current authenticated user from the JWT token
def fetch_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
