from pydantic import BaseModel
from datetime import datetime
from .class_ import ClassOut
from .teacher import TeacherOut
from .room import RoomOut

class LessonInstanceOut(BaseModel):
    id: int
    template_id: int
    class_: ClassOut
    room: RoomOut
    teacher: TeacherOut
    subject: str
    start_time: datetime
    end_time: datetime
    created_at: datetime
    updated_at: datetime

class LessonInstanceCompactOut(BaseModel):
    id: int
    template_id: int
    class_id: int
    room_id: int
    teacher_id: int
    subject: str
    start_time: datetime
    end_time: datetime
    created_at: datetime
    updated_at: datetime

class LessonInstanceIn(BaseModel):
    template_id: int
    class_id: int
    room_id: int
    teacher_id: int
    subject: str
    start_time: datetime
    end_time: datetime