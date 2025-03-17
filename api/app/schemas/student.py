from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .user import UserIn, UserOut

class StudentIn(BaseModel):
    user_id: int 
    class_id: Optional[int] 

class UserStudentIn(UserIn): 
    class_id: Optional[int]

class StudentOut(BaseModel):
    id: int
    user: UserOut 
    class_id: Optional[int] = None