from sqlalchemy.orm import Session
from app.models import Room, RoomAccessCodes
from app.schemas import room
from fastapi import HTTPException, status
from sqlalchemy import and_
from typing import Optional
from app.schemas.room_access_codes import RoomAccessCodeIn
from app.utils import generate_4_letter_code


class RoomAccessCodesCRUD:
    @staticmethod
    def check_if_room_exist(db: Session, room_id: int):
        existing_room = db.query(Room).filter(
            Room.id == room_id
        ).first()
        if not existing_room:
            raise HTTPException(status_code=404, detail="Room not found")
    @staticmethod
    def create_room_access_code(
            db: Session,
            room_access_code_in: RoomAccessCodeIn,
    ):
        RoomAccessCodesCRUD.check_if_room_exist(db, room_access_code_in.room_id)
        generated_code = generate_4_letter_code()
        room_access_code = RoomAccessCodes(
            access_code=generated_code,
            room_id=room_access_code_in.room_id,
        )
        db.add(room_access_code)
        db.commit()
        db.refresh(room_access_code)
        return room_access_code

    @staticmethod
    def regenerate_room_access_code(db: Session, room_id: int):
        room_access_code = RoomAccessCodesCRUD.get_room_access_code(db, room_id)
        new_access_code = generate_4_letter_code()
        room_access_code.access_code = new_access_code
        db.commit()
        db.refresh(room_access_code)
        return room_access_code

    @staticmethod
    def get_room_access_code(db: Session, room_id: int):
        RoomAccessCodesCRUD.check_if_room_exist(db, room_id)

        room_access_code = db.query(RoomAccessCodes).filter(
            RoomAccessCodes.room_id == room_id
        ).first()

        if not room_access_code:
            raise HTTPException(status_code=404, detail="Room not found")
        return room_access_code

    @staticmethod
    def delete_room_access_code(db: Session, room_id: int):
        RoomAccessCodesCRUD.check_if_room_exist(db, room_id)
        room_access_code = db.query(RoomAccessCodes).filter(
            RoomAccessCodes.room_id == room_id
        )
        room_access_code.delete()
        db.commit()
        return None

    @staticmethod
    def check_room_access_code(
            db: Session,
            room_id: int,
            provided_code: str
    ):
        RoomAccessCodesCRUD.check_if_room_exist(db, room_id)
        room_access_code = RoomAccessCodesCRUD.get_room_access_code(db, room_id)
        return room_access_code.access_code == provided_code

    @staticmethod
    def generate_room_access_codes_for_all_rooms(
            db: Session,
    ):
        rooms = db.query(Room).all()
        for room in rooms:
            generated_code = generate_4_letter_code()
            room_access_code = RoomAccessCodes(
                access_code=generated_code,
                room_id=room.id,
            )
            db.add(room_access_code)
            db.commit()
            db.refresh(room_access_code)
        return "successfully generated"

    @staticmethod
    def get_all_room_access_codes(
            db: Session,
            school_id: int
    ):
        room_access_codes = db.query(RoomAccessCodes).filter(school_id == school_id).all()
        return room_access_codes
