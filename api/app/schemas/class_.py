from pydantic import BaseModel 
from datetime import datetime
class ClassIn(BaseModel):
    class_name: str 

class ClassOut(BaseModel):
    id: int 
    class_name: str 
    created_at: datetime
    updated_at: datetime 
    school_id: int 