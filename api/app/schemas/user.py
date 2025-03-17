from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserIn(BaseModel):
    first_name: str
    last_name: str 
    email: str 
    role: str 
    password: str 
    class_id: Optional[int] = None

class UserOut(BaseModel):  
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

