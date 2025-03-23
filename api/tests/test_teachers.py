from .database import client, session
from .fixtures.users import user_factory
from .fixtures.school import school_admin_factory

def test_create_teacher(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    addition_code = school.teacher_addition_code 

    res = client.post("/users/", json={
        "first_name": "Teacher1",
        "last_name": "Surname",
        "email": "teacher1@gmail.com",
        "role": "teacher",
        "password": "asdf1234",
        "addition_code": addition_code
    })

    assert res.status_code == 200
    data = res.json()
    assert data["school_id"] == school_id

def test_create_teacher_invalid_addition_code(client, session, school_admin_factory):
    school_admin_factory()

    res = client.post("/users/", json={
        "first_name": "Teacher1",
        "last_name": "Surname1",
        "email": "teacher1@gmail.com",
        "role": "teacher",
        "password": "asdf1234",
        "addition_code": "invalid_code"
    })

    assert res.status_code == 404
    assert res.json()["detail"] == "School with provided addition code does not exist"

def test_create_teacher_missing_first_name(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    addition_code = school.teacher_addition_code 

    res = client.post("/users/", json={
        "last_name": "Surname1",
        "role": "teacher",
        "email": "teacher1@gmail.com",
        "password": "asdf1234",
        "addition_code": addition_code
    })

    assert res.status_code == 422

def test_create_teacher_with_existing_email(client, session, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    addition_code = school.teacher_addition_code

    existing_teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@gmail.com")

    res = client.post("/users/", json={
        "first_name": "Teacher2",
        "last_name": "Surname2",
        "email": "teacher1@gmail.com",
        "role": "teacher",
        "password": "asdf1234",
        "addition_code": addition_code
    })

    assert res.status_code in (400, 409)
    assert res.json()["detail"] == "User with this email already exists"

def test_get_teachers_empty_list(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    res = client.get(f"/school/{school_id}/teachers")

    assert res.status_code == 200
    assert res.json() == []


def test_get_teachers_list(client, session, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    teacher1 = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
    teacher2 = user_factory(role="teacher", school_id=school_id, email="teacher2@example.com")

    res = client.get(f"/school/{school_id}/teachers")

    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    emails = [student["user"]["email"] for student in data]
    assert "teacher1@example.com" in emails
    assert "teacher2@example.com" in emails


def test_get_single_teacher(client, session, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")

    res = client.get(f"/school/{school_id}/teachers/{teacher.id}")

    assert res.status_code == 200
    data = res.json()
    assert data["user"]["email"] == "teacher1@example.com"
    assert data["id"] == teacher.id

def test_get_not_existing_teacher(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id 

    res = client.get(f"/school/{school_id}/teachers/1")

    assert res.status_code == 404
    assert res.json()["detail"] == "User not found"
