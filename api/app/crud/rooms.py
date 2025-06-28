from sqlalchemy.orm import Session 
from app.models import Room 
from app.schemas import room, room_access_codes
from fastapi import HTTPException, status 
from sqlalchemy import and_
from typing import Optional

from app.crud.room_access_codes import RoomAccessCodesCRUD


class RoomsCRUD:
    @staticmethod
    def create_room(db: Session, school_id: int, room_data: room.RoomIn):
        room = db.query(Room).filter(
            and_(
                Room.room_name == room_data.room_name,
                Room.school_id == school_id
            )
        ).first()

        if room:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"room with name: {room_data.room_name} already exisists"
            )

        db_room = Room(
            room_name= room_data.room_name,
            school_id=school_id,
            capacity=room_data.capacity
        )

        db.add(db_room)
        db.commit()
        db.refresh(db_room)
        RoomAccessCodesCRUD.create_room_access_code(
            db=db,
            room_access_code_in=room_access_codes.RoomAccessCodeIn(
                room_id=db_room.id
            )
        )

        return db_room
    
    @staticmethod
    def get_all_rooms(
        db: Session,
        school_id: int,
        query: Optional[str] = None,
        page: int = 1,
        limit: int = 10
        ):
        base_query = db.query(Room).filter(Room.school_id == school_id)

        if query:
            search = f"%{query.lower()}%"
            base_query = base_query.filter(
                Room.room_name.ilike(search)
            )
        
        rooms = base_query.offset((page - 1) * limit).limit(limit).all()

        has_next = base_query.offset(page * limit).limit(1).all()
        has_next_page = len(has_next) > 0

        total_count = base_query.count()

        return {
            "has_next_page": has_next_page,
            "total_count": total_count,
            "rooms": rooms
        }
        
    
    @staticmethod 
    def get_room_by_id(db: Session, school_id: int, id: int):
        room = db.query(Room).filter(
            and_(
                Room.school_id == school_id,
                Room.id == id
            )
        ).first()

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="This room does not exist in this school"
            )
        
        return room
    
    @staticmethod
    def update_room(db: Session, school_id: int, id: int, room_update_data: room.RoomIn):
        room_to_update = db.query(Room).filter(
            and_(
                Room.id == id,
                Room.school_id == school_id
            )
        ).first()

        if not room_to_update:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found in this school"
            )

        # Check for name conflict
        existing_room = db.query(Room).filter(
            and_(
                Room.room_name == room_update_data.room_name,
                Room.school_id == school_id,
                Room.id != id
            )
        ).first()

        if existing_room:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Another room with the same name already exists"
            )

        room_to_update.room_name = room_update_data.room_name
        room_to_update.capacity = room_update_data.capacity

        db.commit()
        db.refresh(room_to_update)
        return room_to_update

    @staticmethod
    def delete_room(db: Session, school_id: int, id: int):
        room_to_delete = db.query(Room).filter(
            and_(
                Room.id == id,
                Room.school_id == school_id
            )
        ).first()

        if not room_to_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found in this school"
            )

        db.delete(room_to_delete)
        db.commit()
        return {"detail": "Room deleted successfully"}



