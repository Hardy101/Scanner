from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import pandas as pd
from io import BytesIO
import uuid
import os
import logging
import shutil
from datetime import datetime

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

router = APIRouter(tags=["Events Management"])


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
async def create_event(
    name: str = Form(...),
    date: str = Form(...),
    time: Optional[str] = Form(None),
    location: str = Form(...),
    expected_guests: int = Form(...),
    image: Optional[UploadFile] = File(None),
    guest_list: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    if not name or not date or not location or not expected_guests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There is an issue with your form, please check again and fill it correctly",
        )

    # Parse date string to datetime
    try:
        # Handle both ISO format and simple date format
        if "T" in date:
            parsed_date = datetime.fromisoformat(date.replace("Z", "+00:00"))
        else:
            # If it's just a date, set time to midnight
            parsed_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Please use YYYY-MM-DD or ISO format (YYYY-MM-DDTHH:MM:SS)",
        )

    # Handle image upload
    image_url = "default_event.jpg"
    if image and image.filename:
        try:
            # Create uploads directory if it doesn't exist
            upload_dir = "uploads/events"
            os.makedirs(upload_dir, exist_ok=True)

            # Generate unique filename
            file_extension = os.path.splitext(image.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(upload_dir, unique_filename)

            # Save the file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            image_url = file_path
        except Exception as e:
            logging.error(f"Error saving image: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error saving image",
            )

    # Parse guest list if provided
    parsed_guest_list = []
    if guest_list and guest_list.strip():
        try:
            parsed_guest_list = guest_list.split(",")
            parsed_guest_list = [
                guest.strip() for guest in parsed_guest_list if guest.strip()
            ]
        except Exception as e:
            logging.error(f"Error parsing guest list: {str(e)}")

    # Create event data
    event_data = EventCreate(
        name=name,
        date=parsed_date,
        time=time,
        location=location,
        expected_guests=expected_guests,
        image_url=image_url,
        guest_list=parsed_guest_list,
    )

    try:
        new_event = create_event_crud(db=db, event=event_data, user_id=current_user.id)
        return new_event
    except Exception as e:
        logging.error(f"Error creating event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating event",
        )


# Returns the event with the given ID and If the event is not found, it raises a 404 error
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
            email = row.get("email", "")
            guest_data = Guest(name=name, tags=tags, email=email)
            add_guests_to_event(
                db=db, event_id=event_id, guest=guest_data, uuid=str(uuid.uuid4())
            )
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

    # Get all guests associated with this event
    guests = db.query(GuestModel).filter(GuestModel.event_id == event_id).all()

    # Delete QR code files for all guests
    for guest in guests:
        if guest.qr_path and os.path.exists(guest.qr_path):
            try:
                os.remove(guest.qr_path)
            except Exception as e:
                logging.error(
                    f"Error deleting QR code file for guest {guest.id}: {str(e)}"
                )

    # Delete all guests associated with this event
    db.query(GuestModel).filter(GuestModel.event_id == event_id).delete()

    # Delete the event
    db.delete(event)
    db.commit()
    return {"message": "Event and all associated guests deleted"}


# Delete a guest by ID
@router.delete("/delete-guest/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(GuestModel).filter(GuestModel.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    # Delete the QR code file if it exists
    if guest.qr_path and os.path.exists(guest.qr_path):
        try:
            os.remove(guest.qr_path)
        except Exception as e:
            logging.error(f"Error deleting QR code file: {str(e)}")

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


@router.get("/readqrcode/{uuid}")
def view_qrcode(uuid: str, db: Session = Depends(get_db)):
    try:
        print(f"Looking up QR code for UUID: {uuid}")
        guest = db.query(GuestModel).filter(GuestModel.qr_token == uuid).first()
        print(f"Query result: {guest}")

        if not guest:
            print(f"No guest found for UUID: {uuid}")
            raise HTTPException(status_code=404, detail="Guest not found")

        print(f"Found guest: {guest.name}")
        return {"name": guest.name}
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=404, detail="Guest not found")
