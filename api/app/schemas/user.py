from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserIn(BaseModel):
    first_name: str
    last_name: str 
    email: str 
    role: str 
    password: str 

class UserOut(BaseModel):  
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

