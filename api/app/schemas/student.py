from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .user import UserIn, UserOut

class StudentIn(BaseModel):
    school_id: int
    user_id: int 
    class_id: Optional[int] 

class UserStudentIn(UserIn): 
    school_id: int
    class_id: Optional[int]

class StudentOut(BaseModel):
    school_id: int
    id: int
    user: UserOut 
    class_id: Optional[int] = None