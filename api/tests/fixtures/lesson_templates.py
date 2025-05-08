import pytest
from datetime import datetime
from app.models import LessonTemplate
from sqlalchemy.orm import Session


@pytest.fixture
def lesson_template_factory(session: Session):
    def create_lesson_template(
        school_id: int,
        class_id: int,
        room_id: int,
        teacher_id: int,
        subject: str = "Matematyka",
        weekday: int = 0,
        start_time: str = "08:00",
        end_time: str = "08:45",
    ):
        lesson_template = LessonTemplate(
            class_id=class_id,
            room_id=room_id,
            teacher_id=teacher_id,
            subject=subject,
            weekday=weekday,
            start_time=start_time,
            end_time=end_time,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(lesson_template)
        session.commit()
        session.refresh(lesson_template)
        return lesson_template
    return create_lesson_template
