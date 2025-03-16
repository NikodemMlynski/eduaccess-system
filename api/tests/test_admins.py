from app import schemas
from app.models import Administrator
import pytest
from .database import client, session

def test_create_admin(client, session):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "admin@example.com",
        "password": "asdf1234",
        "role": "admin"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "admin"

    # Sprawdzamy, czy admin istnieje w bazie
    admin = session.query(Administrator).filter_by(user_id=data["id"]).first()
    assert admin is not None

def test_create_admin_missing_email(client):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "password": "asdf1234",
        "role": "admin"
    })
    assert res.status_code == 422

def test_create_admin_invalid_role(client):
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "admin@example.com",
        "password": "asdf1234",
        "role": "invalid_role"
    })
    assert res.status_code == 400
    assert res.json()["detail"] == "Invalid user role"

def test_create_admin_duplicate_email(client):
    # Najpierw tworzymy admina
    res = client.post("/users/", json={
        "first_name": "Jakub",
        "last_name": "Bućkowski",
        "email": "duplicateadmin@example.com",
        "password": "asdf1234",
        "role": "admin"
    })
    assert res.status_code == 200

    # Teraz próbujemy z tym samym emailem
    res = client.post("/users/", json={
        "first_name": "Anna",
        "last_name": "Nowak",
        "email": "duplicateadmin@example.com",
        "password": "asdf5678",
        "role": "admin"
    })
    assert res.status_code in (400, 409)
