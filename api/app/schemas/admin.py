from pydantic import BaseModel
from datetime import datetime
from .user import UserOut
class AdminIn(BaseModel):
    user_id: int 

class AdminOut(BaseModel):
    id: int
    user: UserOut