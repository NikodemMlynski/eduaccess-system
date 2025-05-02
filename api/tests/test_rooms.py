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


def test_get_rooms_empty_list(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.get(f"/school/{school_id}/rooms")
    assert res.status_code == 200
    data = res.json()

    assert data["total_count"] == 0
    assert data["has_next_page"] is False
    assert data["rooms"] == []

def test_get_rooms_unauthorized(client, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id

    res = client.get(f"/school/{school_id}/rooms")
    assert res.status_code == 403

def test_get_all_rooms(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room_factory(school_id=school_id, room_name="Room A", capacity=20)
    room_factory(school_id=school_id, room_name="Room B", capacity=30)

    res = client.get(f"/school/{school_id}/rooms")
    assert res.status_code == 200
    data = res.json()

    assert data["total_count"] == 2
    assert data["has_next_page"] is False
    names = [room["room_name"] for room in data["rooms"]]
    assert "Room A" in names
    assert "Room B" in names

def test_get_rooms_with_pagination(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    # Tworzymy 5 sal
    for i in range(5):
        room_factory(school_id=school_id, room_name=f"Room {i}", capacity=20 + i)

    # Pobieramy pierwsze 2
    res = client.get(f"/school/{school_id}/rooms?limit=2&offset=0")
    assert res.status_code == 200
    data = res.json()

    assert data["total_count"] == 5
    assert data["has_next_page"] is True
    assert len(data["rooms"]) == 2

def test_search_rooms_match(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room_factory(school_id=school_id, room_name="Physics Lab", capacity=25)
    room_factory(school_id=school_id, room_name="Chemistry Lab", capacity=30)

    res = client.get(f"/school/{school_id}/rooms?query=Physics")
    assert res.status_code == 200
    data = res.json()

    assert data["total_count"] == 1
    assert data["has_next_page"] is False
    assert data["rooms"][0]["room_name"] == "Physics Lab"

def test_search_rooms_no_match(authorized_admin_client, session, room_factory):
    school, client = authorized_admin_client
    school_id = school.id

    room_factory(school_id=school_id, room_name="History Room", capacity=20)

    res = client.get(f"/school/{school_id}/rooms?query=Biology")
    assert res.status_code == 200
    data = res.json()

    assert data["total_count"] == 0
    assert data["has_next_page"] is False
    assert data["rooms"] == []