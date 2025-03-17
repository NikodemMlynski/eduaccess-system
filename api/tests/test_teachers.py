from app import schemas
from app.models import Teacher
import pytest
from .database import client, session
from .fixtures.users import user_factory

# ------------------------------
# TESTY TWORZENIA NAUCZYCIELA: POST /teachers/
# ------------------------------

def test_create_teacher(client, session):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "teacher@example.com",
        "password": "asdf1234",
        "role": "teacher"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "teacher@example.com"
    assert data["role"] == "teacher"

    # Sprawdzamy, czy nauczyciel istnieje w bazie
    teacher = session.query(Teacher).filter_by(user_id=data["id"]).first()
    assert teacher is not None

def test_create_teacher_missing_email(client):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "password": "asdf1234",
        "role": "teacher"
    })
    assert res.status_code == 422

def test_create_teacher_invalid_role(client):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "teacher@example.com",
        "password": "asdf1234",
        "role": "invalid_role"
    })
    assert res.status_code == 400
    assert res.json()["detail"] == "Invalid user role"

def test_create_teacher_duplicate_email(client):
    # Najpierw tworzymy studenta
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "duplicate@example.com",
        "password": "asdf1234",
        "role": "teacher"
    })
    assert res.status_code == 200

    # Teraz próbujemy z tym samym emailem
    res = client.post("/users/", json={
        "first_name": "Anna",
        "last_name": "Nowak",
        "email": "duplicate@example.com",
        "password": "asdf5678",
        "role": "teacher"
    })
    assert res.status_code in (400, 409)



# ------------------------------
# TESTY POBIERANIA WSZYSTKICH NAUCZYCIELI: GET /teachers/
# ------------------------------

def test_get_all_teachers_empty(client):
    res = client.get("/teachers/")
    assert res.status_code == 200
    assert res.json() == []

def test_get_all_teachers(client, user_factory):
    user_factory(role="teacher", email="teacher1@example.com")
    user_factory(role="teacher", email="teacher2@example.com")
    res = client.get("/teachers/")
    assert res.status_code == 200
    assert len(res.json()) == 2



# ------------------------------
# TESTY POBIERANIA NAUCZYCIELA PO ID: GET /teachers/{id}
# ------------------------------

def test_get_teacher_by_id(client, user_factory):
    teacher = user_factory(role="teacher", email="teacher1@example.com")
    res = client.get(f"/teachers/{teacher.id}")
    assert res.status_code == 200
    assert res.json()["user"]["email"] == "teacher1@example.com"

def test_get_not_existing_teacher(client):
    res = client.get("/teachers/999")
    assert res.status_code == 404

