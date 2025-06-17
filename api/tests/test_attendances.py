import pytest
from .conftest import authorized_admin_client, authorized_teacher_client, authorized_student_client
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
    assert data["status"] == "present"
    assert res.status_code == 200

def test_create_attendance_invalid_status(
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
        "status": "invalid_status",
        "manual_adjustment": True
    }
    res = client.post(f"/school/{school_id}/attendances", json=payload)
    assert res.status_code == 400
    assert res.json()["detail"] == "Attendance status must be present or absent or late"

def test_create_attendance_conflict(
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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )
    payload = {
        "lesson_id": lesson_instance.id,
        "student_id": student.id,
        "status": "present",
        "manual_adjustment": True
    }
    res = client.post(f"/school/{school_id}/attendances", json=payload)
    assert res.status_code in (400, 409)
    assert res.json()["detail"] == f"Attendance computer science for student Test already exists"



def test_create_attendance_unauthorized(
        school_admin_factory,
        session,
        client,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    school, _, _ = school_admin_factory()
    school_id = school.id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")

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
    assert res.status_code == 401


def test_create_attendance_not_permitted(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    student1, client = authorized_student_client
    school_id = student1.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")

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
    assert res.status_code == 403
    assert res.json()["detail"] == "You are not permitted to managa attendances as a student"


def test_create_attendance_for_student_that_is_not_assigned_to_class_that_had_lesson_instance(
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
    klass2 = classes_factory(school_id=school_id, class_name="4H")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    student2 = user_factory(school_id=school_id, role="student", email="student2@example.com", class_id=klass2.id)

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
        "student_id": student2.id,
        "status": "present",
        "manual_adjustment": True
    }
    res = client.post(f"/school/{school_id}/attendances", json=payload)
    assert res.status_code == 400
    assert res.json()["detail"] == "Student is not assigned to the class that you're trying to assign attendance for"



def test_delete_attendance(
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

    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")

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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.delete(f"/school/{school_id}/attendances/{attendance.id}")
    assert res.status_code == 200

def test_delete_attendance_not_found(
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

    res = client.delete(f"/school/{school_id}/attendances/999")
    assert res.status_code == 404


def test_delete_attendance_not_permitted(
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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.delete(f"/school/{school_id}/attendances/{attendance.id}")
    assert res.status_code == 403

def test_update_attendance_admin(
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

    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    payload = {
        "lesson_id": lesson_instance.id,
        "student_id": student.id,
        "status": "absent",
        "manual_adjustment": True
    }

    res = client.put(f"/school/{school_id}/attendances/{attendance.id}", json=payload)
    assert res.status_code == 200
    assert res.json()["status"] == "absent"


def test_update_attendance_teacher_having_lesson_instance(
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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )
    payload = {
        "lesson_id": attendance.lesson_id,
        "student_id": attendance.student_id,
        "status": "absent",
        "manual_adjustment": True
    }

    res = client.put(f"/school/{school_id}/attendances/{attendance.id}", json=payload)
    data = res.json()
    assert data["status"] == "absent"
    assert res.status_code == 200


def test_update_attendance_not_permitted_teacher(
        authorized_teacher_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    teacher_c, client = authorized_teacher_client
    school_id = teacher_c.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")

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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )
    payload = {
        "lesson_id": attendance.lesson_id,
        "student_id": attendance.student_id,
        "status": "absent",
        "manual_adjustment": True
    }

    res = client.put(f"/school/{school_id}/attendances/{attendance.id}", json=payload)
    data = res.json()
    assert res.status_code == 403
    assert data["detail"] == "You are not permitted to manage attendances for lesson that you are not teaching"

def test_update_attendance_not_permitted_student(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    student_c, client = authorized_student_client
    school_id = student_c.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")

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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )
    payload = {
        "lesson_id": attendance.lesson_id,
        "student_id": attendance.student_id,
        "status": "absent",
        "manual_adjustment": True
    }

    res = client.put(f"/school/{school_id}/attendances/{attendance.id}", json=payload)
    data = res.json()
    assert res.status_code == 403
    assert data["detail"] == "You are not permitted to managa attendances as a student"

def test_update_attendance_invalid_data(
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
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )
    payload = {
        "lesson_id": attendance.lesson_id,
        "student_id": attendance.student_id,
        "status": "invalid_status",
        "manual_adjustment": True
    }

    res = client.put(f"/school/{school_id}/attendances/{attendance.id}", json=payload)
    data = res.json()
    assert res.status_code == 400
    assert data["detail"] == "Attendance status must be present or absent or late"


def test_update_attendance_not_found(
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


    payload = {
        "lesson_id": 2, # this hardcoded data doesn't matter because first condition that is checked is if attendance exists
        "student_id": 2,
        "status": "invalid_status",
        "manual_adjustment": True
    }

    res = client.put(f"/school/{school_id}/attendances/999", json=payload)
    assert res.status_code == 404


def test_get_all_attendances_for_class_admin(
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
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher@example.com")

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
    date_text = "2025-05-15"

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.get(f"/school/{school_id}/attendances/classes/{klass.id}/day/{date_text}")
    data = res.json()
    assert res.status_code == 200
    assert data[0]["status"] == "present"


def test_get_all_attendances_for_class_not_permitted(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    student_c, client = authorized_student_client
    school_id = student_c.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher1@example.com")

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
    date_text = "2025-05-15"

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.get(f"/school/{school_id}/attendances/classes/{klass.id}/day/{date_text}")
    assert res.status_code == 403


def test_get_all_attendances_for_class_teacher(
        authorized_teacher_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    teacher_c, client = authorized_teacher_client
    school_id = teacher_c.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher1@example.com")

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
    date_text = "2025-05-15"

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.get(f"/school/{school_id}/attendances/classes/{klass.id}/day/{date_text}")
    data = res.json()
    assert res.status_code == 200
    assert data[0]["status"] == "present"



def test_get_all_attendances_for_student_admin(
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
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(school_id=school_id, role="student", email="student1@example.com", class_id=klass.id)
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher1@example.com")

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
    date_text = "2025-05-15"

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.get(f"/school/{school_id}/attendances/student/{student.id}/day/{date_text}")
    data = res.json()
    assert res.status_code == 200
    assert data[0]["status"] == "present"


def test_get_all_attendances_for_student_student(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    student, client = authorized_student_client
    school_id = student.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher1@example.com")

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
    date_text = "2025-05-15"

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.get(f"/school/{school_id}/attendances/student/{student.id}/day/{date_text}")
    data = res.json()
    assert res.status_code == 200
    assert data[0]["status"] == "present"

def test_get_all_attendances_for_student_unauthorized(
        school_admin_factory,
        client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    school, _, _ = school_admin_factory()
    school_id = school.id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher1@example.com")
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
    date_text = "2025-05-15"

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )

    res = client.get(f"/school/{school_id}/attendances/student/{student.id}/day/{date_text}")
    assert res.status_code == 401


def test_get_all_attendances_for_student_empty_list(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    student, client = authorized_student_client
    school_id = student.user.school_id

    res = client.get(f"/school/{school_id}/attendances/student/{student.id}/day/2025-05-15")
    data = res.json()
    assert res.status_code == 200
    assert data == []


def test_get_all_attendances_stats_for_student_empty_list(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    student, client = authorized_student_client
    school_id = student.user.school_id

    res = client.get(f"/school/{school_id}/attendances/student/{student.id}/stats?date_from=2025-05-01&date_to=2025-05-31")
    data = res.json()
    assert res.status_code == 200
    assert data == []


def test_get_all_attendances_stats_for_student_student(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        attendance_factory
):
    student, client = authorized_student_client
    school_id = student.user.school_id

    room = room_factory(school_id=school_id)
    klass = classes_factory(school_id=school_id, class_name="4D")
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher1@example.com")

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
    start_time1 = datetime(year=2025, month=5, day=15, hour=11, minute=0)
    end_time1 = datetime(year=2025, month=5, day=15, hour=11, minute=45)

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    lesson_instance1 = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time1,
        end_time=end_time1,
    )
    attendance = attendance_factory(
        lesson_id=lesson_instance.id,
        student_id=student.id,
        status="present",
        manual_adjustment=True
    )
    attendance1 = attendance_factory(
        lesson_id=lesson_instance1.id,
        student_id=student.id,
        status="absent",
        manual_adjustment=True
    )

    res = client.get(f"/school/{school_id}/attendances/student/{student.id}/stats?date_from=2025-05-01&date_to=2025-05-31")
    data = res.json()
    print(data)
    assert res.status_code == 200
    assert data[0]["subject"] == "computer science"
    assert data[0]["present_percent"] == 50.0