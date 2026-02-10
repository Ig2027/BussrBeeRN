from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class SavedRoute(BaseModel):
    user_id: str
    route_name: str
    origin: str
    destination: str