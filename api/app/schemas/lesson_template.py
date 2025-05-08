from pydantic import BaseModel
from datetime import datetime
from .class_ import ClassOut
from .teacher import TeacherOut
from .room import RoomOut

class LessonTemplateIn(BaseModel):
    class_id: int
    room_id: int
    teacher_id: int
    subject: str
    weekday: int
    start_time: str
    end_time: str

class LessonTemplateOut(BaseModel):
    id: int
    class_: ClassOut
    room: RoomOut
    teacher: TeacherOut
    subject: str
    weekday: int
    start_time: str
    end_time: str
    created_at: datetime
