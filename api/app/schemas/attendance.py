from pydantic import BaseModel
from datetime import datetime

from .lesson_instance import LessonInstanceCompactOut
from .student import StudentOut


class AttendanceIn(BaseModel):
    student_id: int
    lesson_id: int
    status: str
    manual_adjustment: bool

class AttendanceOut(BaseModel):
    id: int
    student: StudentOut
    lesson: LessonInstanceCompactOut
    status: str
    manual_adjustment: bool
    created_at: datetime
