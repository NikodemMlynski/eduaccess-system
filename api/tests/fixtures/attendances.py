import pytest
from datetime import datetime
from app.models import Attendance
from sqlalchemy.orm import Session

@pytest.fixture
def attendance_factory(session: Session):
    def create_attendance(
        lesson_id: int,
            student_id: int,
            status: str,
            manual_adjustment: bool
    ):
        attendance = Attendance(
            lesson_id=0,
            student_id=0,
            status=0,
            manual_adjustment=0,
        )
        session.add(attendance)
        session.commit()
        session.refresh(attendance)
        return attendance
    return create_attendance