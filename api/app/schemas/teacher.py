from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserOut

class TeacherIn(BaseModel):
    user_id: int 

class TeacherOut(BaseModel):
    id: int
    user: UserOut

