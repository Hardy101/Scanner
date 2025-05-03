from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
from io import BytesIO
import uuid
import os

# Local imports
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

router = APIRouter(tags=["Events"])


@router.get("/")
def get_status():
    return {"message": "Your URL is working! Events API is up and running."}


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
@router.post("/add", response_model=EventOut)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    new_event = create_event_crud(db=db, event=event, user_id=current_user.id)
    return new_event


# Returns the event with the given ID
# If the event is not found, it raises a 404 error
@router.get("/get-event/{event_id}", response_model=EventOut)
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


# Adds guests to an event and returns the newly added guest
@router.post("/add-guest/{event_id}", response_model=GuestResponse)
def add_guest(event_id: int, guest: Guest, db: Session = Depends(get_db)):
    if not guest:
        raise HTTPException(
            status_code=400, detail="The list of guests cannot be empty"
        )
    # for guest in guest:
    if not guest.name or not guest.tags:
        raise HTTPException(
            status_code=400, detail="Guest name and tags cannot be empty"
        )
    new_guest = add_guests_to_event(
        db=db, event_id=event_id, guest=guest, uuid=str(uuid.uuid4())
    )
    return new_guest


# Route to get guests by event ID
@router.get("/guests/{event_id}", response_model=List[GuestResponse])
def get_guests_by_event(event_id: int, db: Session = Depends(get_db)):
    guests = db.query(GuestModel).filter(GuestModel.event_id == event_id).all()
    return guests


# Route to add guests in bulk
@router.post("/guests-bulk/{event_id}", response_model=List[Guest])
async def add_bulk_guests(
    event_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        processed: List[Guest] = []
        for _, row in df.iterrows():
            name = row.get("name")
            tags = row.get("tags", "")
            guest_data = Guest(name=name, tags=tags)
            add_guests_to_event(db=db, event_id=event_id, guest=guest_data)
            # tags = [tag.strip() for tag in str(tags_str).split(",")] if tags_str else []
            processed.append({"name": name, "tags": tags})
        print(processed)

        return processed

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Update an event by ID
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


# Delete an event by ID
@router.delete("/delete/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}


# Delete a guest by ID
@router.delete("/delete-guest/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(GuestModel).filter(GuestModel.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    db.delete(guest)
    db.commit()
    return {"message": "Guest deleted"}


@router.get("/qrcode/{uuid}")
def view_qrcode(uuid: str, db: Session = Depends(get_db)):
    guest = db.query(GuestModel).filter(GuestModel.qr_token == uuid).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    file_path = guest.qr_path

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="QR code file not found")

    return FileResponse(path=guest.qr_path, media_type="image/png")
