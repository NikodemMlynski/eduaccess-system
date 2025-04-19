import pytest
from app.models import Class

from .database import client, session
from .fixtures.classes import classes_factory
from .fixtures.school import school_admin_factory


def test_create_class_unauthorized_client(client, session, school_admin_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id 

    res = client.post(f"/school/{school_id}/classes", json={"class_name": "4D"})
    assert res.status_code == 403


def test_create_class(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.post(f"/school/{school_id}/classes", json={"class_name": "4D"})
    assert res.status_code == 200
    data = res.json()
    assert data["class_name"] == "4D"


@pytest.mark.parametrize("invalid_name", ["9A", "0B", "AA", "4a", "44", "4", "A4", ""])
def test_create_invalid_class_names(authorized_admin_client, session, invalid_name):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.post(f"/school/{school_id}/classes", json={"class_name": invalid_name})
    assert res.status_code == 400


def test_create_duplicate_class(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    client.post(f"/school/{school_id}/classes", json={"class_name": "3B"})
    res = client.post(f"/school/{school_id}/classes", json={"class_name": "3B"})

    assert res.status_code == 409


def test_get_all_classes(authorized_admin_client, session, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id

    classes_factory(school_id=school_id, class_name="4D")
    classes_factory(school_id=school_id, class_name="5H")

    res = client.get(f"/school/{school_id}/classes")
    assert res.status_code == 200
    data = res.json()

    assert len(data) == 2
    class_names = [c["class_name"] for c in data]
    assert "4D" in class_names
    assert "5H" in class_names


def test_get_class_by_id(authorized_admin_client, session, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id

    class_ = classes_factory(school_id=school_id, class_name="2C")
    res = client.get(f"/school/{school_id}/classes/{class_.id}")
    assert res.status_code == 200
    assert res.json()["class_name"] == "2C"


def test_get_class_by_id_not_found(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.get(f"/school/{school_id}/classes/999")
    assert res.status_code == 404


def test_get_classes_by_year(authorized_admin_client, session, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id

    classes_factory(school_id=school_id, class_name="3A")
    classes_factory(school_id=school_id, class_name="3B")
    classes_factory(school_id=school_id, class_name="4C")

    res = client.get(f"/school/{school_id}/classes/class_year/3")
    assert res.status_code == 200
    data = res.json()

    assert len(data) == 2
    assert all(cls["class_name"].startswith("3") for cls in data)


@pytest.mark.parametrize("invalid_year", [0, 9, -1, 100])
def test_get_classes_by_invalid_year(authorized_admin_client, session, invalid_year):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.get(f"/school/{school_id}/classes/class_year/{invalid_year}")
    assert res.status_code == 400


def test_delete_class(authorized_admin_client, session, classes_factory):
    school, client = authorized_admin_client
    school_id = school.id

    class_ = classes_factory(school_id=school_id, class_name="6Z")
    res = client.delete(f"/school/{school_id}/classes/{class_.id}")
    assert res.status_code == 200
    assert res.json()["detail"] == "Class deleted successfully"

    # Confirm deletion
    get_res = client.get(f"/school/{school_id}/classes/{class_.id}")
    assert get_res.status_code == 404


def test_delete_class_not_found(authorized_admin_client, session):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.delete(f"/school/{school_id}/classes/9999")
    assert res.status_code == 404
