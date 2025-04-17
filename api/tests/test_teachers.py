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

def test_get_teachers_without_admin_token(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    res = client.get(f"/school/{school_id}/teachers")

    assert res.status_code == 403

def test_get_teachers_empty_list(authorized_admin_client, session, school_admin_factory):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.get(f"/school/{school_id}/teachers")

    assert res.status_code == 200
    assert res.json() == []

def test_get_teachers_list(authorized_admin_client, session, school_admin_factory, user_factory):
    school, client = authorized_admin_client
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

def test_get_teachers_with_pagination(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    # Tworzymy 15 nauczycieli
    for i in range(15):
        user_factory(role="teacher", school_id=school_id, email=f"teacher{i}@example.com")

    res = client.get(f"/school/{school_id}/teachers?page=1&limit=10")
    assert res.status_code == 200
    assert len(res.json()) == 10

    res_page2 = client.get(f"/school/{school_id}/teachers?page=2&limit=10")
    assert res_page2.status_code == 200
    assert len(res_page2.json()) == 5


def test_get_teachers_with_query_match(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    user_factory(role="teacher", school_id=school_id, email="john.doe@example.com", first_name="John", last_name="Doe")
    user_factory(role="teacher", school_id=school_id, email="jane.smith@example.com", first_name="Jane", last_name="Smith")

    res = client.get(f"/school/{school_id}/teachers?query=john")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["user"]["email"] == "john.doe@example.com"


def test_get_teachers_with_query_no_match(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    user_factory(role="teacher", school_id=school_id, email="john.doe@example.com", first_name="John", last_name="Doe")

    res = client.get(f"/school/{school_id}/teachers?query=nonexistent")
    assert res.status_code == 200
    assert res.json() == []


def test_get_teachers_limit_edge_case(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    for i in range(3):
        user_factory(role="teacher", school_id=school_id, email=f"t{i}@example.com")

    res = client.get(f"/school/{school_id}/teachers?page=1&limit=2")
    assert res.status_code == 200
    assert len(res.json()) == 2

    res2 = client.get(f"/school/{school_id}/teachers?page=2&limit=2")
    assert res2.status_code == 200
    assert len(res2.json()) == 1

def test_get_single_teacher(authorized_admin_client, session, school_admin_factory, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")

    res = client.get(f"/school/{school_id}/teachers/{teacher.id}")

    assert res.status_code == 200
    data = res.json()
    assert data["user"]["email"] == "teacher1@example.com"
    assert data["id"] == teacher.id

def test_get_not_existing_teacher(authorized_admin_client, session, school_admin_factory):
    school, client = authorized_admin_client
    school_id = school.id 

    res = client.get(f"/school/{school_id}/teachers/1")

    assert res.status_code == 404
    assert res.json()["detail"] == "User not found"
