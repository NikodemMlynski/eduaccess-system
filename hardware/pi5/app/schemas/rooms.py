from pydantic import BaseModel


class RoomAccessCodeOut(BaseModel):
    room_id: int 
    access_code: str 
    room_name: str
