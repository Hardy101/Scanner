from fastapi import Depends, FastAPI
from auth import router as auth_router
from security import verify_token
from models import User

app = FastAPI()

app.include_router(auth_router, prefix="/auth")

@app.get("/protected")
def protected_route(user: User = Depends(verify_token)):
    return {"message": f"Welcome, {user.email}! This is a protected route."}