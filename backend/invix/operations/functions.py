from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas


def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(name=event.name, date=event.date, location=event.location)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


def get_events(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Event).offset(skip).limit(limit).all()


def add_guests_to_event(db: Session, event_id: int, guests: List[schemas.Guest]):
    # Find the event by ID
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Add each guest to the event
    for guest in guests:
        db_guest = models.Guest(
            name=guest.name,
            tags=",".join(guest.tags),  # Store the tags as a comma-separated string
            event_id=db_event.id,  # Link the guest to the event
        )
        db.add(db_guest)

    db.commit()  # Commit the guests to the database
    return db_event  # Return the updated event (with guests now associated)
