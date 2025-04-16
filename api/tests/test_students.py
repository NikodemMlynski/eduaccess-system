from app import schemas
from app.models import Student
import pytest
from .database import client, session
from .fixtures.users import user_factory
from .fixtures.school import school_admin_factory

def test_create_student(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    addition_code = school.student_addition_code

    res = client.post('/users/', json={
        "first_name": "Student1",
        "last_name": "Surname2",
        "email": "student1@gmail.com",
        "role": "student",
        "password": "asdf1234",
        "addition_code": addition_code
    })

    assert res.status_code == 200
    data = res.json()
    assert data["school_id"] == school_id

def test_create_student_invalid_addition_code(client, session, school_admin_factory):
    school_admin_factory()

    res = client.post('/users/', json={
        "first_name": "Student1",
        "last_name": "Surname2",
        "email": "student1@gmail.com",
        "role": "student",
        "password": "asdf1234",
        "addition_code": "invalid_code"
    })

    assert res.status_code == 404
    assert res.json()["detail"] == "School with provided addition code does not exist"

def test_create_student_missing_email(client, session, school_admin_factory):
    school_admin_factory()

    res = client.post('/users/', json={
        "first_name": "Student1",
        "last_name": "Surname2",
        "role": "student",
        "password": "asdf1234",
        "addition_code": "invalid_code"
    })

    assert res.status_code == 422

def test_create_student_with_existing_email(client, session, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    addition_code = school.student_addition_code

    existing_student = user_factory(role="student", school_id=school_id, email="student1@example.com")
    res = client.post("/users/", json={
        "first_name": "Teacher2",
        "last_name": "Surname2",
        "email": "student1@example.com",
        "role": "student",
        "password": "asdf1234",
        "addition_code": addition_code
    })

    assert res.status_code in (400, 409)

def test_get_students_empty_list(authorized_admin_client, session):
    school, client = authorized_admin_client
    # school, _, _ = school_admin_factory()
    school_id = school.id

    res = client.get(f"/school/{school_id}/students")

    assert res.status_code == 200
    assert res.json() == []

def test_get_students_without_admin_token(client, session, school_admin_factory):
    school, _, _ = school_admin_factory() 

    school_id = school.id 
    res = client.get(f"/school/{school_id}/students")

    assert res.status_code == 403


def test_get_students_list(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    student1 = user_factory(role="student", school_id=school_id, email="student1@example.com")
    student2 = user_factory(role="student", school_id=school_id, email="student2@example.com")

    res = client.get(f"/school/{school_id}/students")

    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    emails = [student["user"]["email"] for student in data]
    assert "student1@example.com" in emails
    assert "student2@example.com" in emails


def test_get_single_student(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    student = user_factory(role="student", school_id=school_id, email="student1@example.com")

    res = client.get(f"/school/{school_id}/students/{student.id}")

    assert res.status_code == 200
    data = res.json()
    assert data["user"]["email"] == "student1@example.com"
    assert data["id"] == student.id

def test_get_not_existing_student(authorized_admin_client, session, school_admin_factory):
    school, client = authorized_admin_client
    school_id = school.id 

    res = client.get(f"/school/{school_id}/students/1")

    assert res.status_code == 404
    assert res.json()["detail"] == "User not found"

def test_update_student(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    student = user_factory(role="student", school_id=school_id, email="student1@example.com")

    update_payload = {
        "first_name": "UpdatedName",
        "last_name": "UpdatedSurname",
        "email": "updatedemail@example.com"
    }

    res = client.put(
        f"/school/{school_id}/students/{student.id}",
        json=update_payload
    )

    assert res.status_code == 200
    data = res.json()
    assert data["user"]["email"] == "updatedemail@example.com"
    assert data["user"]["first_name"] == "UpdatedName"
    assert data["user"]["last_name"] == "UpdatedSurname"
    assert data["id"] == student.id

def test_update_nonexistent_student(authorized_admin_client):
    school, client = authorized_admin_client
    school_id = school.id

    update_payload = {
        "first_name": "Updated",
        "last_name": "Name",
        "email": "nonexistent@example.com"
    }

    res = client.put(
        f"/school/{school_id}/students/9999",
        json=update_payload
    )

    assert res.status_code == 404
    assert res.json()["detail"] == "User not found"

def test_delete_student(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    student = user_factory(role="student", school_id=school_id, email="student1@example.com")

    res = client.delete(f"/school/{school_id}/students/{student.id}")

    assert res.status_code == 200
    assert res.json()["message"] == "User deleted successfully"

    # Spróbuj pobrać studenta ponownie — powinno być 404
    res_get = client.get(f"/school/{school_id}/students/{student.id}")
    assert res_get.status_code == 404

def test_delete_nonexistent_student(authorized_admin_client):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.delete(f"/school/{school_id}/students/9999")

    assert res.status_code == 404
    assert res.json()["detail"] == "User not found"

def test_update_student_without_admin_token(client, session, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    student = user_factory(role="student", school_id=school_id, email="student1@example.com")

    update_payload = {
        "first_name": "Hacker",
        "last_name": "User",
        "email": "hacked@example.com"
    }

    res = client.put(
        f"/school/{school_id}/students/{student.id}",
        json=update_payload
    )

    assert res.status_code == 403

def test_delete_student_without_admin_token(client, session, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    student = user_factory(role="student", school_id=school_id, email="student1@example.com")

    res = client.delete(f"/school/{school_id}/students/{student.id}")

    assert res.status_code == 403
