from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .room import RoomOut
from .user import UserOut


class AccessLogOutRaw(BaseModel):
    id: int
    user_id: int
    room_id: int
    access_start_time: datetime
    access_end_time: Optional[datetime]
    reason: str
    access_status: str
    created_at: datetime

class AccessLogOut(BaseModel):
    id: int
    user: UserOut
    room: RoomOut
    access_start_time: datetime
    access_end_time: Optional[datetime]
    reason: str
    access_status: str
    created_at: datetime

class AccessLogIn(BaseModel):
    user_id: int
    room_id: int
    access_time: datetime

    # 1. sprawdzić czy nie istnieje access log bez access_end_time
    # dla user_id, room_id, access_time

    # if istnieje?
    # 1 - NIE:
        # 2.Sprawdzić czy dany student ma aktualnie lekcje w danej sali
        # user_id -> Student
        # Student -> class_id
        # pobrać lekcje dla aktualnego czasu (stworzyć taką funkcje) dla danej klasy
        # porównać otrzymany LessonInstance.room_id == room_id z body

        # if LessonInstance.room_id == room_id z body:
        # TAK
            # utworzenie AccessLog status granted, end_time: null
            # przygotowanie pod logikę websocketów
            # przygotowanie pod logikę raspberry pi
        # NIE
            # utworzenie AccessLog status denied
            # przygotowanie pod logikę websocketów

    # 1 - TAK:
        # zupdateowania access_logu access_end_time = access_time z body
        # przygotowanie pod logikę websocketów
        # przygotować pod logikę raspberry pi
