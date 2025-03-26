from app import schemas
from app.models import Administrator
import pytest
from .database import client, session
from .fixtures.users import user_factory
from app.config import settings
from .fixtures.school import school_admin_factory

def test_create_school_and_admin(client):
    res = client.post(f"super_admin/schools/{settings.super_admin_code}", json={
        "school": {
            "name": "test school name",
            "address": "test address",
        },
        "admin": {
            "first_name": "name",
            "last_name": "surname",
            "email": "admin@example.com",
            "password": "asdf1234",
            "role": "admin"
            }
    })
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "test school name"


def test_create_school_and_admin_missing_email(client):
    res = client.post(f"/super_admin/schools/{settings.super_admin_code}", json={
        "school": {
            "name": "test school name",
            "address": "test address",
        },
        "admin": {
            "first_name": "name",
            "last_name": "surname",
            "password": "asdf1234",
            "role": "admin"
            }
    })
    assert res.status_code == 422

def test_create_school_and_admin_missing_school(client):
    res = client.post(f"/super_admin/schools/{settings.super_admin_code}", json={
        "admin": {
            "first_name": "name",
            "last_name": "surname",
            "password": "asdf1234",
            "role": "admin"
        }
    })
    assert res.status_code == 422

def test_create_school_and_admin_duplicate_school_name(client):
    res = client.post(f"/super_admin/schools/{settings.super_admin_code}", json={
        "school": {
            "name": "test school name",
            "address": "test address",
        },
        "admin": {
            "first_name": "name",
            "last_name": "surname",
            "email": "admin@example.com",
            "password": "asdf1234",
            "role": "admin"
            }
    })
    assert res.status_code == 200

    res = client.post(f"/super_admin/schools/{settings.super_admin_code}", json={
        "school": {
            "name": "test school name",
            "address": "test address",
        },
        "admin": {
            "first_name": "name",
            "last_name": "surname",
            "email": "admin@example.com",
            "password": "asdf1234",
            "role": "admin"
            }
    })
    assert res.status_code in (400, 409)

def test_invalid_super_admin_code_action(client):
    res = client.post(f"super_admin/schools/invalid", json={
        "school": {
            "name": "test school name",
            "address": "test address",
        },
        "admin": {
            "first_name": "name",
            "last_name": "surname",
            "email": "admin@example.com",
            "password": "asdf1234",
            "role": "admin"
            }
    })
    assert res.status_code == 403



# ------------------------------
# TESTY POBIERANIA WSZYSTKICH ADMINÓW: GET /admins/
# ------------------------------
def test_get_all_schools_empty(client):
    res = client.get(f"/super_admin/{settings.super_admin_code}/schools")
    assert res.status_code == 200
    assert res.json() == []

def test_get_all_schools(client, school_admin_factory):
    school_admin_factory(
        school_name="School 1",
        school_address="School address",
        admin_email="admin1@example.com",
        admin_first_name="Admin",
        admin_last_name="User",
        admin_password="admin1234"
        )
    school_admin_factory(
        school_name="School 2",
        school_address="School2 address",
        admin_email="admin2@example.com",
        admin_first_name="Admin2",
        admin_last_name="User2",
        admin_password="admin1234"
        )
    res = client.get(f"/super_admin/{settings.super_admin_code}/schools")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    assert data[0]["name"] in ("School 1", "School 2")
    assert data[1]["name"] in ("School 1", "School 2")
