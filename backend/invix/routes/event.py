from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Event, Guest as GuestModel
from schemas import (
    PublicUser,
    EventUpdate,
    EventOut,
    EventResponse,
    Guest,
    EventCreate,
    GuestResponse,
)
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


# Returns the list of all the events
@router.get("/all", response_model=List[EventResponse])
def get_all_events(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    events = fetch_events(db=db, skip=skip, limit=limit)
    return events


# Returns the list of events belonging to the authenticated user
@router.get("/events", response_model=List[EventResponse])
def get_user_events(
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    events = db.query(Event).filter(Event.created_by == current_user.id).all()
    if not events:
        return []
    return events


# Returns a newly-created event
@router.post("/add-event", response_model=EventOut)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    new_event = create_event_crud(db=db, event=event, user_id=current_user.id)
    print(new_event)
    return new_event


# Returns the event with the given ID
# If the event is not found, it raises a 404 error
@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


# Route to get all guests
@router.get("/guests/all", response_model=List[GuestResponse])
def get_all_guests(db: Session = Depends(get_db)):
    guests = db.query(GuestModel).all()
    if not guests:
        return []
    return guests


# Adds guests to an event and returns the updated list of guests
@router.post("/add-guest/{event_id}", response_model=List[Guest])
def add_guests(event_id: int, guests: List[Guest], db: Session = Depends(get_db)):
    add_guests_to_event(db=db, event_id=event_id, guests=guests)

    all_guests = db.query(GuestModel).filter(GuestModel.event_id == event_id).all()
    return all_guests


# Route to get guests by event ID
@router.get("/guests/{event_id}", response_model=List[GuestResponse])
def get_guests_by_event(event_id: int, db: Session = Depends(get_db)):
    guests = db.query(GuestModel).filter(GuestModel.event_id == event_id).all()
    return guests


@router.put("/update/{event_id}", response_model=EventOut)
def update_event(event_id: int, updated: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    for key, value in updated.model_dump().items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)
    return event


@router.delete("/delete/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}


@router.delete("/delete-guest/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(GuestModel).filter(GuestModel.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    db.delete(guest)
    db.commit()
    return {"message": "Guest deleted"}
