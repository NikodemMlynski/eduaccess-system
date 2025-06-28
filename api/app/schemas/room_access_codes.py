from pydantic import BaseModel, ConfigDict
from app.schemas.room import RoomOut


class RoomAccessCodeRaw(BaseModel):
    id: int
    room_id: int
    access_code: str

class RoomAccessCodeOut(BaseModel):
    id: int
    room: RoomOut
    access_code: str

class RoomAccessCodeIn(BaseModel):
    room_id: int
