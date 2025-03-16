from app import schemas
from app.models import Teacher
import pytest
from .database import client, session

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
