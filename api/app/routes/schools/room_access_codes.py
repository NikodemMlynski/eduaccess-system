from fastapi import APIRouter, Depends, Query

from ...crud.room_access_codes import RoomAccessCodesCRUD
from ...models import User
from app.database import get_db
from ...crud.rooms import RoomsCRUD
from ...schemas import room, utils, room_access_codes
from ...role_checker import admin_only
from sqlalchemy.orm import Session
from typing import List, Optional
from ...oauth2 import school_checker, get_current_user

router = APIRouter(
    prefix="/room_access_codes",
    tags=["Room Access Codes"]
)

@router.post("/", response_model=room_access_codes.RoomAccessCodeOut, dependencies=[Depends(admin_only)])
def create_access_room_code(
        school_id: int,
        room_access_code_data: room_access_codes.RoomAccessCodeIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomAccessCodesCRUD.create_room_access_code(
        db=db,
        room_access_code_in=room_access_code_data,
    )

@router.put(
    "/regenerate_code/room/{room_id}",
    response_model=room_access_codes.RoomAccessCodeOut,
    dependencies=[Depends(admin_only)]
)
def regenerate_access_code(
        school_id: int,
        room_id: int,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomAccessCodesCRUD.regenerate_room_access_code(
        room_id=room_id,
        db=db
    )

@router.get(
    "/room/{room_id}",
    response_model=room_access_codes.RoomAccessCodeOut
)
def get_room_access_code(
        room_id: int,
        school_id: int,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomAccessCodesCRUD.get_room_access_code(
        room_id=room_id,
        db=db
    )

@router.post("/generate", dependencies=[Depends(admin_only)])
def generate_room_access_codes(
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    RoomAccessCodesCRUD.generate_room_access_codes_for_all_rooms(
        db=db
    )

@router.get("/", dependencies=[Depends(admin_only)], response_model=List[room_access_codes.RoomAccessCodeOut])
def get_all_room_access_codes(
        school_id: int,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return RoomAccessCodesCRUD.get_all_room_access_codes(
        db=db,
        school_id=school_id,
    )