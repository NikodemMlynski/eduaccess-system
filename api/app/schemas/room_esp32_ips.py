from pydantic import BaseModel, ConfigDict
from app.schemas.room import RoomOut

class RoomEsp32IpIn(BaseModel):
    room_id: int
    ip_address: str

class RoomEsp32IpOut(BaseModel):
    id: int
    ip_address: str
    room: RoomOut

class RoomEsp32IpRaw(BaseModel):
    id: int
    room_id: int
    ip_address: str
