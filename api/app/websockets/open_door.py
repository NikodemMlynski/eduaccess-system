import requests
from ..crud.room_access_codes import RoomAccessCodesCRUD
from sqlalchemy.orm import Session

def notify_rpi_open_door(
        db: Session,
        room_id: int,
):
    try:
        new_access_code = RoomAccessCodesCRUD.get_room_access_code(
            db=db,
            room_id=room_id,
        )
        print("Generated new: ", new_access_code.access_code)
        response = requests.post("http://192.168.1.21:5000/eduaccess/v1/rpi/open-door", json={
            "access_code": new_access_code.access_code,
            "room_name": new_access_code.room.room_name,
            "room_id": new_access_code.room.id,
        })
        # tu sie sprawdzi czy drzwi sie otworzyly itp
        print("RPI response:", response.json())
    except Exception as e:
        print(f"Failed to trigger door opening: {e}")
