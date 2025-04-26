from pydantic import BaseModel 
from datetime import datetime
from typing import List

class RoomIn(BaseModel):
    room_name: str 
    capacity: int 

class RoomOut(BaseModel):
    id: int 
    room_name: str 
    capacity: int 
    created_at: datetime
    updated_at: datetime 
    school_id: int

class PaginatedRooms(BaseModel):
    total_count: int 
    has_next_page: bool 
    rooms: List[RoomOut]