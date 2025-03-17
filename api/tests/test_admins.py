from app import schemas
from app.models import Administrator
import pytest
from .database import client, session
from .fixtures.users import user_factory

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


# ------------------------------
# TESTY POBIERANIA WSZYSTKICH ADMINÓW: GET /admins/
# ------------------------------

def test_get_all_admins_empty(client):
    res = client.get("/admins/")
    assert res.status_code == 200
    assert res.json() == []

def test_get_all_admins(client, user_factory):
    user_factory(role="admin", email="admin1@example.com")
    user_factory(role="admin", email="admin2@example.com")
    res = client.get("/admins/")
    assert res.status_code == 200
    assert len(res.json()) == 2



# ------------------------------
# TESTY POBIERANIA ADMINA PO ID: GET /admins/{id}
# ------------------------------

def test_get_admin_by_id(client, user_factory):
    teacher = user_factory(role="admin", email="admin1@example.com")
    res = client.get(f"/admins/{teacher.id}")
    assert res.status_code == 200
    assert res.json()["user"]["email"] == "admin1@example.com"

def test_get_not_existing_admin(client):
    res = client.get("/admins/999")
    assert res.status_code == 404

