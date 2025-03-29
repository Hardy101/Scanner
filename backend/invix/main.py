from fastapi import Depends, FastAPI, HTTPException
from auth import router as auth_router
from security import verify_token
from models import User

app = FastAPI()

app.include_router(auth_router, prefix="/auth")

@app.get("/protected")
def protected_route(user: User = Depends(verify_token)):
    return {"message": f"Welcome, {user.email}! This is a protected route."}

def check_role(required_role: str):
    def role_dependency(user: User = Depends(verify_token)):
        if user.role != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_dependency

@app.get("/protected")
def protected_route(user: User = Depends(verify_token)):
    return {"message": f"Welcome, {user.email}! You have access."}

@app.get("/admin-only")
def admin_route(user: User = Depends(check_role("admin"))):
    return {"message": "Welcome, Admin! This route is restricted."}

@app.get("/event-manager")
def event_manager_route(user: User = Depends(check_role("event_manager"))):
    return {"message": "Welcome, Event Manager! You can manage events."}