from sqlalchemy.orm import Session 
from app.models import Room 
from app.schemas import room 
from fastapi import HTTPException, status 
from sqlalchemy import and_ 

# class Room(Base):
#     __tablename__ = "rooms"
#     id = Column(Integer, primary_key=True, nullable=False)
#     room_name = Column(String, nullable=False)
#     capacity = Column(SmallInteger, nullable=False)
#     created_at = Column(DateTime, default=func.now(), nullable=False)
#     updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
#     school_id = Column(Integer, ForeignKey("school.id"), nullable=True)

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
        return db_room
    
    @staticmethod
    def get_all_rooms(db: Session, school_id: int):
        rooms = db.query(Room).filter(Room.school_id == school_id).all()
        return rooms 
    
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



