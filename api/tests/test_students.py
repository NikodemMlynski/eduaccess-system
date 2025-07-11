from app import schemas
from app.models import Student
import pytest
from .fixtures.classes import classes_factory
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
    school_id = school.id

    res = client.get(f"/school/{school_id}/students")

    assert res.status_code == 200
    data = res.json()
    assert data["users"] == []
    assert data["total_count"] == 0
    assert data["has_next_page"] is False


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

    assert len(data["users"]) == 2
    emails = [student["user"]["email"] for student in data["users"]]
    assert "student1@example.com" in emails
    assert "student2@example.com" in emails

    assert data["total_count"] == 2
    assert data["has_next_page"] is False


def test_get_students_with_pagination(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    for i in range(15):
        user_factory(role="student", school_id=school_id, email=f"student{i}@example.com")

    res = client.get(f"/school/{school_id}/students?page=1&limit=10")
    assert res.status_code == 200
    data = res.json()
    assert len(data["users"]) == 10
    assert data["total_count"] == 15
    assert data["has_next_page"] is True

    res_page2 = client.get(f"/school/{school_id}/students?page=2&limit=10")
    assert res_page2.status_code == 200
    data2 = res_page2.json()
    assert len(data2["users"]) == 5
    assert data2["total_count"] == 15
    assert data2["has_next_page"] is False


def test_get_students_with_query_match(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    user_factory(role="student", school_id=school_id, email="alice.koch@example.com", first_name="Alice", last_name="Koch")
    user_factory(role="student", school_id=school_id, email="bob.nowak@example.com", first_name="Bob", last_name="Nowak")

    res = client.get(f"/school/{school_id}/students?query=alice")
    assert res.status_code == 200
    data = res.json()

    assert len(data["users"]) == 1
    assert data["users"][0]["user"]["email"] == "alice.koch@example.com"
    assert data["total_count"] == 1
    assert data["has_next_page"] is False


def test_get_students_with_query_no_match(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    user_factory(role="student", school_id=school_id, email="student1@example.com", first_name="Mark", last_name="Twain")

    res = client.get(f"/school/{school_id}/students?query=nonexistent")
    assert res.status_code == 200
    data = res.json()

    assert data["users"] == []
    assert data["total_count"] == 0
    assert data["has_next_page"] is False


def test_get_students_limit_edge_case(authorized_admin_client, session, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    for i in range(3):
        user_factory(role="student", school_id=school_id, email=f"student{i}@example.com")

    res = client.get(f"/school/{school_id}/students?page=1&limit=2")
    assert res.status_code == 200
    data = res.json()
    assert len(data["users"]) == 2
    assert data["total_count"] == 3
    assert data["has_next_page"] is True

    res2 = client.get(f"/school/{school_id}/students?page=2&limit=2")
    assert res2.status_code == 200
    data2 = res2.json()
    assert len(data2["users"]) == 1
    assert data2["total_count"] == 3
    assert data2["has_next_page"] is False



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

def test_assign_student_to_class(authorized_admin_client, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id

    student = user_factory(role="student", school_id=school_id)
    class_= classes_factory(school_id=school_id, class_name="4D")
    class_id = class_.id
    res = client.put(f"/school/{school_id}/students/{student.id}/classes/{class_.id}")

    assert res.status_code == 200
    data = res.json()
    assert data["class_id"] == class_id

def test_remove_student_from_class(authorized_admin_client, user_factory, classes_factory, session):
    school, client = authorized_admin_client
    school_id = school.id

    class_ = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(role="student", school_id=school_id, class_id=class_.id)

    res = client.delete(f"/school/{school_id}/students/{student.id}/classes/{class_.id}")

    assert res.status_code == 200
    data = res.json()
    assert data["class_id"] is None

def test_assign_student_to_nonexistent_class(authorized_admin_client, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    student = user_factory(role="student", school_id=school_id)
    fake_class_id = 9999  # zakładamy, że nie istnieje

    res = client.put(f"/school/{school_id}/students/{student.id}/classes/{fake_class_id}")

    assert res.status_code == 404

def test_remove_student_from_class_they_do_not_belong_to(authorized_admin_client, user_factory, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id

    class_ = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(role="student", school_id=school_id)  # nie ma przypisanej klasy

    res = client.delete(f"/school/{school_id}/students/{student.id}/classes/{class_.id}")

    assert res.status_code in [400, 404]  # w zależności od twojej implementacji

def test_assign_student_to_class_as_regular_user(user_factory, classes_factory, client, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    other_student = user_factory(role="student", school_id=school_id)
    class_ = classes_factory(school_id=school_id, class_name="4D")

    res = client.put(f"/school/{school_id}/students/{other_student.id}/classes/{class_.id}")

    assert res.status_code == 403

def test_get_student_by_id_as_admin(authorized_admin_client, user_factory):
    school, client = authorized_admin_client
    school_id = school.id

    student = user_factory(role="student", school_id=school_id)

    res = client.get(f"/school/{school_id}/students/user_id/{student.user_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == student.id


def test_get_student_by_id_as_teacher(authorized_teacher_client, user_factory):
    teacher, client = authorized_teacher_client
    school_id = teacher.user.school_id

    student = user_factory(role="student", school_id=school_id)

    res = client.get(f"/school/{school_id}/students/user_id/{student.user_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == student.id


def test_get_student_by_id_as_current_user(authorized_student_client):
    student, client = authorized_student_client
    school_id = student.user.school_id
    user_id = student.user_id

    res = client.get(f"/school/{school_id}/students/user_id/{user_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == student.id


def test_get_student_by_id_not_permitted(authorized_student_client, user_factory):
    student, client = authorized_student_client
    school_id = student.user.school_id

    other_student = user_factory(role="student", school_id=school_id)

    res = client.get(f"/school/{school_id}/students/user_id/{other_student.user_id}")
    assert res.status_code == 403
    assert res.json()["detail"] == "You are not permitted to access data for another user"


def test_get_student_by_id_not_found(authorized_admin_client):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.get(f"/school/{school_id}/students/user_id/999999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Student not found"


def test_get_student_by_id_unauthorized(client, user_factory, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    student = user_factory(role="student", school_id=school_id)

    res = client.get(f"/school/{school_id}/students/user_id/{student.user_id}")
    assert res.status_code == 401