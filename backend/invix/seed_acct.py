from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from security import hash_password

# Initialize the database
Base.metadata.create_all(bind=engine)
db: Session = SessionLocal()

# Users to add
users = [
    {"name": "Eghosa", "email": "eghordia130@example.com", "password": "adminpass", "role": "admin"},
    {"name": "Monica", "email": "manager@example.com", "password": "managerpass", "role": "event_manager"},
    {"name": "Ross", "email": "invitee@example.com", "password": "inviteepass", "role": "invitee"},
]

for user_data in users:
    user = User(
        name=user_data["name"],
        email=user_data["email"],
        hashed_password=hash_password(user_data["password"]),
        role=user_data["role"],
    )
    db.add(user)


db.commit()
db.close()

print("Users inserted successfully!")
