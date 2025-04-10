from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Event
from schemas import PublicUser
from schemas import EventUpdate, EventOut, EventResponse, Guest
from database import get_db
from operations.functions import (
    get_events as fetch_events,
    create_event as create_event_crud,
    add_guests_to_event,
    fetch_current_user,
)
from typing import List

router = APIRouter(tags=["Events"])


@router.get("/")
def get_status():
    return {"message": "Your URL is working! API is up and running."}


@router.get("/all", response_model=List[EventResponse])
def get_all_events(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    events = fetch_events(db=db, skip=skip, limit=limit)
    return events


@router.get("/events", response_model=List[EventResponse])
def get_user_events(
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    events = db.query(Event).filter(Event.created_by == current_user.id).all()
    if not events:
        return []
        raise HTTPException(status_code=404, detail="No events found for user")
    return events


@router.post("/add-event", response_model=EventOut)
def create_event(
    event: EventOut,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    new_event = create_event_crud(db=db, event=event, user_id=current_user.id)
    print(new_event)
    return new_event


@router.post("/{event_id}/guests/", response_model=EventResponse)
def add_guests_route(event_id: int, guests: List[Guest], db: Session = Depends(get_db)):
    db_event = add_guests_to_event(db=db, event_id=event_id, guests=guests)
    return db_event


@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/{event_id}", response_model=EventOut)
def update_event(event_id: int, updated: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    for key, value in updated.model_dump().items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}
