from sqlalchemy.orm import Session
from app.models import Room, RoomEsp32Ips
from app.schemas import room
from fastapi import HTTPException, status
from sqlalchemy import and_
from typing import Optional
from app.schemas.room_esp32_ips import RoomEsp32IpIn

class RoomEsp32IpsCRUD:
    @staticmethod
    def check_if_room_exist(db: Session, room_id: int):
        existing_room = db.query(Room).filter(
            Room.id == room_id,
        ).first()
        if not existing_room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    @staticmethod
    def check_if_conflict(
            db: Session,
            room_id: int
    ):
        RoomEsp32IpsCRUD.check_if_room_exist(db, room_id)
        existing_room_esp32_ip = db.query(RoomEsp32Ips).filter(
            RoomEsp32Ips.room_id == room_id,
        ).first()
        if existing_room_esp32_ip:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Esp 32 ip address already exists for this room")
    @staticmethod
    def create_room_esp32_ip(
            db: Session,
            room_esp32_ip_in: RoomEsp32IpIn
    ):
        RoomEsp32IpsCRUD.check_if_conflict(
            db=db,
            room_id=room_esp32_ip_in.room_id,
        )

        room_esp32_ip = RoomEsp32Ips(
            room_id=room_esp32_ip_in.room_id,
            ip_address=room_esp32_ip_in.ip_address,
        )
        db.add(room_esp32_ip)
        db.commit()
        db.refresh(room_esp32_ip)
        return room_esp32_ip

    @staticmethod
    def delete_room_esp32_ip(db: Session, room_id: int):
        RoomEsp32IpsCRUD.check_if_room_exist(db, room_id)
        room_esp32_ip = db.query(RoomEsp32Ips).filter(
            RoomEsp32Ips.room_id == room_id
        )
        room_esp32_ip.delete()
        db.commit()
        return None

    @staticmethod
    def get_room_esp32_ip(
            db: Session,
            room_id: int
    ):
        RoomEsp32IpsCRUD.check_if_room_exist(db, room_id)
        room_esp32_ip = db.query(RoomEsp32Ips).filter(
            RoomEsp32Ips.room_id == room_id
        ).first()

        if not room_esp32_ip:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room esp32 ip not found")

        return room_esp32_ip

    @staticmethod
    def update_room_esp32_ip(
            db: Session,
            room_id: int,
            room_esp32_ip_in: RoomEsp32IpIn
    ):
        RoomEsp32IpsCRUD.check_if_room_exist(db, room_id)
        room_esp32_ip = db.query(RoomEsp32Ips).filter(
            RoomEsp32Ips.room_id == room_id
        ).first()
        if not room_esp32_ip:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room esp32 ip not found")

        room_esp32_ip.ip_address = room_esp32_ip_in.ip_address
        db.commit()
        db.refresh(room_esp32_ip)
        return room_esp32_ip
