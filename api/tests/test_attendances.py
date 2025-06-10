import pytest
from .conftest import authorized_admin_client
from .fixtures.lesson_instances import lesson_instance_factory
from .fixtures.lesson_templates import lesson_template_factory
from .fixtures.rooms import room_factory
from .fixtures.school import school_admin_factory
from .fixtures.users import user_factory
from .fixtures.classes import classes_factory
from datetime import datetime
from datetime import datetime, timedelta
from .fixtures.attendances import attendance_factory


def test_create_attendance_admin(
        authorized_admin_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)

    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        weekday=0
    )

    start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
    end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    payload = {
        "lesson_id": lesson_instance.id,
        "student_id": student.id,
        "status": "present",
        "manual_adjustment": True
    }
    res = client.post(f"/school/{school_id}/attendances", json=payload)
    data = res.json()
    assert data["status"] == "present"
    assert res.status_code == 200


def test_create_attendance_teacher_having_lesson_instance(
        authorized_teacher_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    teacher, client = authorized_teacher_client
    school_id = teacher.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)

    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        weekday=0
    )

    start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
    end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    payload = {
        "lesson_id": lesson_instance.id,
        "student_id": student.id,
        "status": "present",
        "manual_adjustment": True
    }
    res = client.post(f"/school/{school_id}/attendances", json=payload)
    data = res.json()
    # assert data["status"] == "present"
    assert res.status_code == 200

