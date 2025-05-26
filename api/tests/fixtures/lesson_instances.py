import pytest
from datetime import datetime
from app.models import LessonInstance
from sqlalchemy.orm import Session

@pytest.fixture
def lesson_instance_factory(session: Session):
    def create_lesson_instance(
            template_id: int,
            class_id: int,
            room_id: int,
            teacher_id: int,
            subject: str,
            start_time: datetime,
            end_time: datetime
    ):
        lesson_instance = LessonInstance(
            template_id=template_id,
            class_id=class_id,
            room_id=room_id,
            teacher_id=teacher_id,
            subject=subject,
            start_time=start_time,
            end_time=end_time
        )
        session.add(lesson_instance)
        session.commit()
        session.refresh(lesson_instance)
        return lesson_instance
    return create_lesson_instance