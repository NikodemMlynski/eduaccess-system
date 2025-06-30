from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)

class PaginatedRooms(BaseModel):
    total_count: int 
    has_next_page: bool 
    rooms: List[RoomOut]

class RoomRawOut(BaseModel):
    id: int
    room_name: str

class PaginatedRoomRaw(BaseModel):
    total_count: int
    has_next_page: bool
    rooms: List[RoomRawOut]