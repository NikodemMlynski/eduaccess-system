from app import schemas
from app.models import Student
import pytest
from .database import client, session

def test_create_student(client, session):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "student@example.com",
        "password": "asdf1234",
        "role": "student"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "student@example.com"
    assert data["role"] == "student"

    # Sprawdzamy, czy student istnieje w bazie
    student = session.query(Student).filter_by(user_id=data["id"]).first()
    assert student is not None

def test_create_student_missing_email(client):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "password": "asdf1234",
        "role": "student"
    })
    assert res.status_code == 422

def test_create_student_invalid_role(client):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "student2@example.com",
        "password": "asdf1234",
        "role": "invalid_role"
    })
    assert res.status_code == 400
    assert res.json()["detail"] == "Invalid user role"

def test_create_student_duplicate_email(client):
    # Najpierw tworzymy studenta
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "duplicate@example.com",
        "password": "asdf1234",
        "role": "student"
    })
    assert res.status_code == 200

    # Teraz próbujemy z tym samym emailem
    res = client.post("/users/", json={
        "first_name": "Anna",
        "last_name": "Nowak",
        "email": "duplicate@example.com",
        "password": "asdf5678",
        "role": "student"
    })
    assert res.status_code in (400, 409)
