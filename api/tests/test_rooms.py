import pytest
from app.models import Room
from .database import client, session
from .fixtures.school import school_admin_factory
from .fixtures.rooms import room_factory


def test_create_room_unauthorized(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    res = client.post(f"/school/{school_id}/rooms", json={"room_name": "101", "capacity": 30})
    assert res.status_code == 403


def test_create_room(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.post(f"/school/{school_id}/rooms", json={"room_name": "101", "capacity": 30})
    assert res.status_code == 200
    data = res.json()
    assert data["room_name"] == "101"
    assert data["capacity"] == 30


def test_create_duplicate_room(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room_factory(school_id=school_id, room_name="202", capacity=25)
    res = client.post(f"/school/{school_id}/rooms", json={"room_name": "202", "capacity": 25})

    assert res.status_code == 409


def test_get_all_rooms(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room_factory(school_id=school_id, room_name="201", capacity=30)
    room_factory(school_id=school_id, room_name="202", capacity=35)

    res = client.get(f"/school/{school_id}/rooms")
    assert res.status_code == 200
    data = res.json()

    assert len(data) == 2
    names = [r["room_name"] for r in data]
    assert "201" in names
    assert "202" in names


def test_get_room_by_id(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room = room_factory(school_id=school_id, room_name="301", capacity=20)
    res = client.get(f"/school/{school_id}/rooms/{room.id}")

    assert res.status_code == 200
    data = res.json()
    assert data["room_name"] == "301"
    assert data["capacity"] == 20


def test_get_room_by_id_not_found(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.get(f"/school/{school_id}/rooms/9999")
    assert res.status_code == 404


def test_update_room(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room = room_factory(school_id=school_id, room_name="401", capacity=20)

    res = client.put(f"/school/{school_id}/rooms/{room.id}", json={"room_name": "402", "capacity": 45})
    assert res.status_code == 200
    data = res.json()

    assert data["room_name"] == "402"
    assert data["capacity"] == 45


def test_update_room_not_found(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.put(f"/school/{school_id}/rooms/9999", json={"room_name": "XYZ", "capacity": 10})
    assert res.status_code == 404


def test_delete_room(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room = room_factory(school_id=school_id, room_name="501", capacity=50)
    res = client.delete(f"/school/{school_id}/rooms/{room.id}")

    assert res.status_code == 200
    assert res.json()["detail"] == "Room deleted successfully"

    # Confirm deletion
    get_res = client.get(f"/school/{school_id}/rooms/{room.id}")
    assert get_res.status_code == 404


def test_delete_room_not_found(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.delete(f"/school/{school_id}/rooms/123456")
    assert res.status_code == 404
