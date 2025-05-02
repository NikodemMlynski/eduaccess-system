from fastapi import APIRouter, Depends, Query
from ...models import User
from app.database import get_db 
from ...crud.rooms import RoomsCRUD 
from ...schemas import room, utils
from ...role_checker import admin_only
from sqlalchemy.orm import Session 
from typing import List, Optional
from ...oauth2 import school_checker, get_current_user

router = APIRouter(
    prefix="/rooms",
    tags=["rooms"]
)

@router.post("/", response_model=room.RoomOut, dependencies=[Depends(admin_only)])
def create_room(
    school_id: int,
    room_data: room.RoomIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return RoomsCRUD.create_room(
        db=db,
        school_id=school_id,
        room_data=room_data
    )

@router.get("/", response_model=room.PaginatedRooms, dependencies=[Depends(admin_only)])
def get_all_rooms(
    school_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    query: Optional[str] = Query(None, description="Search by name"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Result limit per page")
):
    return RoomsCRUD.get_all_rooms(
        db=db,
        school_id=school_id,
        query=query,
        page=page,
        limit=limit
    )

@router.get("/{id}", response_model=room.RoomOut, dependencies=[Depends(admin_only)])
def get_room_by_id(
    school_id: int,
    id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return RoomsCRUD.get_room_by_id(
        db=db,
        school_id=school_id,
        id=id
    )

@router.put("/{id}", response_model=room.RoomOut, dependencies=[Depends(admin_only)])
def update_room(
    school_id: int,
    id: int,
    room_update_data: room.RoomIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return RoomsCRUD.update_room(
        db=db,
        school_id=school_id,
        id=id,
        room_update_data=room_update_data
    )

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_room(
    school_id: int,
    id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return RoomsCRUD.delete_room(
        db=db,
        school_id=school_id,
        id=id
    )