from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from models import Event, Guest
from schemas import EventCreate, Guest as GuestSchema
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


def create_event(db: Session, event: EventCreate, user_id: int):
    db_event = Event(
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
    return db.query(Event).offset(skip).limit(limit).all()


def add_guests_to_event(db: Session, event_id: int, guest: GuestSchema):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Add each guest to the event
    print(guest)
    db_guest = Guest(
        name=guest.name,
        tags=guest.tags,
        event_id=db_event.id,
    )
    db.add(db_guest)

    db.commit()
    return db_guest


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


def add_bulk_guests_to_event(db: Session, event_id: int, guests: GuestSchema):
    for guest in guests:
        if not guest.name or not guest.tags:
            raise HTTPException(
                status_code=400, detail="Guest name and tags cannot be empty"
            )
    add_guests_to_event(db=db, event_id=event_id, guests=guests)
    all_guests = db.query(GuestModel).filter(GuestModel.event_id == event_id).all()
    return all_guests
