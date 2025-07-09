from fastapi import APIRouter, Depends, Query

from ...crud.room_esp32_ips import RoomEsp32IpsCRUD
from ...models import User, RoomEsp32Ips
from app.database import get_db
from ...crud.rooms import RoomsCRUD
from ...schemas import room, room_esp32_ips
from ...role_checker import admin_only
from sqlalchemy.orm import Session
from typing import List, Optional
from ...oauth2 import school_checker, get_current_user
from ...schemas.room_esp32_ips import RoomEsp32IpIn
from ...schemas.super_admin import SchoolOut

router = APIRouter(
    prefix="/room_esp32_ips",
    tags=["Room esp32 ips"]
)

@router.post("/", response_model=room_esp32_ips.RoomEsp32IpOut, dependencies=[Depends(admin_only)])
def create_room_esp32_ip(
        school_id: int,
        room_esp32_ip_in: room_esp32_ips.RoomEsp32IpIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomEsp32IpsCRUD.create_room_esp32_ip(
        db=db,
        room_esp32_ip_in=room_esp32_ip_in,
    )

@router.get("/room/{room_id}", response_model=room_esp32_ips.RoomEsp32IpOut, dependencies=[Depends(admin_only)])
def get_room_esp32_ip(
        room_id: int,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomEsp32IpsCRUD.get_room_esp32_ip(
        db=db,
        room_id=room_id,
    )

@router.delete("/room/{room_id}", dependencies=[Depends(admin_only)])
def delete_room_esp32_ip(
        room_id: int,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomEsp32IpsCRUD.delete_room_esp32_ip(
        db=db,
        room_id=room_id,
    )

@router.put("/room/{room_id}", dependencies=[Depends(admin_only)])
def update_room_esp32_ip(
        room_id: int,
        room_esp32_ip_in: RoomEsp32IpIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomEsp32IpsCRUD.update_room_esp32_ip(
        db=db,
        room_id=room_id,
        room_esp32_ip_in=room_esp32_ip_in,
    )