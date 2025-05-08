import pytest
from .fixtures.lesson_templates import lesson_template_factory
from .fixtures.rooms import room_factory
from .fixtures.school import school_admin_factory
from .fixtures.users import user_factory
from .fixtures.classes import classes_factory


def test_create_lesson_template(authorized_admin_client, session, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    payload = {
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "subject": "Historia",
        "weekday": 2,
        "start_time": "09:00",
        "end_time": "09:45"
    }

    res = client.post(f"/school/{school_id}/lesson_templates", json=payload)
    assert res.status_code == 200
    data = res.json()
    print(data)
    assert data["subject"] == "Historia"
    assert data["class_"]["id"] == klass.id


def test_create_lesson_template_duration_invalid(authorized_admin_client, session, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    res = client.post(f"/school/{school_id}/lesson_templates", json={
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "subject": "Chemia",
        "weekday": 3,
        "start_time": "10:00",
        "end_time": "10:50"
    })

    assert res.status_code == 400
    assert "duration must be 45 minutes" in res.text


def test_create_lesson_template_collision(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")
    # Zakładamy, że fixture tworzy plan na wtorek 08:00–08:45
    existing = lesson_template_factory(
        school_id=school_id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="Fizyka",
        weekday=1,
        start_time="08:00",
        end_time="08:45"
    )
    assert True
    res = client.post(f"/school/{school_id}/lesson_templates", json={
        "class_id": 9,
        "room_id": 11,
        "teacher_id": 1,
        "subject": "Informatyka",
        "weekday": 1,
        "start_time": "08:00",
        "end_time": "08:45"
    })

    assert res.status_code == 409


def test_get_lesson_templates_by_class(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    lesson_template_factory(
        school_id=school_id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="Geografia",
        weekday=4,
        start_time="11:00",
        end_time="11:45"
    )

    res = client.get(f"/school/{school_id}/lesson_templates/classes/{klass.id}")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert data[0]["subject"] == "Geografia"

def test_get_lesson_templates_by_room(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    lesson_template_factory(
        school_id=school_id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="Geografia",
        weekday=4,
        start_time="11:00",
        end_time="11:45"
    )

    res = client.get(f"/school/{school_id}/lesson_templates/rooms/{room.id}")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert data[0]["subject"] == "Geografia"

def test_get_lesson_templates_by_teacher(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")

    lesson_template_factory(
        school_id=school_id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="Geografia",
        weekday=4,
        start_time="11:00",
        end_time="11:45"
    )

    res = client.get(f"/school/{school_id}/lesson_templates/teachers/{teacher.id}")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert data[0]["subject"] == "Geografia"

def test_get_lesson_templates_by_class_empty_list(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    klass = classes_factory(school_id=school_id, class_name="4D")

    res = client.get(f"/school/{school_id}/lesson_templates/classes/{klass.id}")
    assert res.status_code == 200
    data = res.json()
    assert data == []

def test_update_lesson_template(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")
    template = lesson_template_factory(
        school_id=school_id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="Biologia",
        weekday=2,
        start_time="10:00",
        end_time="10:45"
    )

    res = client.put(f"/school/{school_id}/lesson_templates/{template.id}", json={
        "class_id": klass.id,
        "room_id": room.id,
        "teacher_id": teacher.id,
        "subject": "Chemia",
        "weekday": 2,
        "start_time": "10:00",
        "end_time": "10:45"
    })

    assert res.status_code == 200
    assert res.json()["subject"] == "Chemia"


def test_delete_lesson_template(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id
    room = room_factory(school_id=school_id)
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    klass = classes_factory(school_id=school_id, class_name="4D")
    template = lesson_template_factory(
        school_id=school_id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="WF",
        weekday=0,
        start_time="12:00",
        end_time="12:45"
    )

    res = client.delete(f"/school/{school_id}/lesson_templates/{template.id}")
    assert res.status_code == 200
    assert res.json()["detail"] == "Lesson template deleted successfully"

def test_delete_lesson_template_not_found(authorized_admin_client, session, lesson_template_factory, room_factory, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.delete(f"/school/{school_id}/lesson_templates/999")
    assert res.status_code == 404
