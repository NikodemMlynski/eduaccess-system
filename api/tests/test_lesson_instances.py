import pytest

from .conftest import authorized_admin_client
from .fixtures.lesson_instances import lesson_instance_factory
from .fixtures.lesson_templates import lesson_template_factory
from .fixtures.rooms import room_factory
from .fixtures.school import school_admin_factory
from .fixtures.users import user_factory
from .fixtures.classes import classes_factory
from datetime import datetime

def test_create_lesson_instance(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")
    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        subject="computer science",
        weekday=0
    )
    start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
    end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
    payload = {
        "template_id": template.id,
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "subject": "computer science",
    }

    res = client.post(f"/school/{school_id}/lesson_instances", json=payload)
    assert res.status_code == 200
    data = res.json()
    print(data)
    assert data["class_"]["class_name"] == "4D"
    assert data["teacher"]["user"]["email"] == "teacher@example.com"


def test_create_lesson_instance_invalid_duration(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")
    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        subject="computer science",
        weekday=0
    )
    start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
    end_time = datetime(year=2025, month=5, day=15, hour=10, minute=55)
    payload = {
        "template_id": template.id,
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "subject": "computer science",
    }

    res = client.post(f"/school/{school_id}/lesson_instances", json=payload)
    assert res.status_code == 400
    assert "duration must be 45 minutes" in res.text


def test_create_lesson_instance_conflict(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")
    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        subject="computer science",
        weekday=0
    )
    start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
    end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)

    existing = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    payload = {
        "template_id": template.id,
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "subject": "computer science",
    }

    res = client.post(f"/school/{school_id}/lesson_instances", json=payload)
    assert res.status_code == 409

# zrób jeszcze testy dla pobierania: dla klasy, sali, nauczyciela, pusta tablica w klasach,
def test_get_lesson_instances_by_class_empty_list(classes_factory, authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id
    klass = classes_factory(school_id=school_id, class_name="4D")

    res = client.get(f"/school/{school_id}/lesson_instances/classes/{klass.id}?date_str=2025-05-10")
    assert res.status_code == 200
    assert res.json() == []

def test_get_lesson_instances_by_class(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

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

    res = client.get(f"/school/{school_id}/lesson_instances/classes/{klass.id}?date_str=2025-05-15")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["id"] == lesson_instance.id


def test_get_lesson_instances_by_room(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

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

    res = client.get(f"/school/{school_id}/lesson_instances/rooms/{room.id}?date_str=2025-05-15")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["id"] == lesson_instance.id


def test_get_lesson_instances_by_teacher(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

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

    res = client.get(f"/school/{school_id}/lesson_instances/teachers/{teacher.id}?date_str=2025-05-15")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["id"] == lesson_instance.id

def test_get_all_lesson_instances_for_class_unauthorized(client, school_admin_factory, classes_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    klass = classes_factory(school_id=school_id, class_name="4D")

    res = client.get(f"/school/{school_id}/lesson_instances/classes/{klass.id}/?date_str=2025-05-10")
    assert res.status_code == 403

def test_update_lesson_instance_invalid_data(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory,
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        subject="computer science",
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
        "template_id": template.id,
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
    }

    res = client.put(f"/school/{school_id}/lesson_instances/{lesson_instance.id}", json=payload)
    assert res.status_code in (400, 422)


def test_update_lesson_instance(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory,
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        subject="computer science",
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
        "template_id": template.id,
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "subject": "math",
    }

    res = client.put(f"/school/{school_id}/lesson_instances/{lesson_instance.id}", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["subject"] == "math"
    print(data)


def test_delete_lesson_instance(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory,
):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role="teacher", email="teacher@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        subject="computer science",
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

    res = client.delete(f"/school/{school_id}/lesson_instances/{lesson_instance.id}")
    assert res.status_code == 200
    data = res.json()
    print(data)
    assert data["detail"] == "Lesson instance deleted successfully"

def test_delete_lesson_instance_not_found(
        authorized_admin_client,
        session,
        lesson_template_factory,
        room_factory,
        user_factory,
        classes_factory,
        lesson_instance_factory,
):
    school, client = authorized_admin_client
    school_id = school.id


    res = client.delete(f"/school/{school_id}/lesson_instances/999")
    assert res.status_code == 404
