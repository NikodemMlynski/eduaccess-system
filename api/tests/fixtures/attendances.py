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
            lesson_id=lesson_id,
            student_id=student_id,
            status=status,
            manual_adjustment=manual_adjustment,
        )
        session.add(attendance)
        session.commit()
        session.refresh(attendance)
        return attendance
    return create_attendance