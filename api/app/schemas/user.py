from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserInRequest(BaseModel):
    addition_code: str
    first_name: str
    last_name: str 
    email: str 
    role: str 
    password: str 
    class_id: Optional[int] = None

class UserIn(BaseModel):
    school_id: int
    first_name: str
    last_name: str 
    email: str 
    role: str 
    password: str 
    class_id: Optional[int] = None

class UserOut(BaseModel):  
    school_id: Optional[int]
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

