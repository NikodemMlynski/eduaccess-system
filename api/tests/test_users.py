## TODO: 

## tutaj trzeba napisać funkcje która będzie testować endpoint:
## GET users/ który powinien pobierać aktualnie zalogowanego użytkownika
## trzeba go przetestować dla następnych przypadków:


def test_not_authenticated_user(client):
    res = client.get("/users")
    assert res.status_code == 401

def test_get_authenticated_student(authorized_student_client):
    student, client = authorized_student_client

    res = client.get("/users")
    data = res.json()

    assert res.status_code == 200
    assert data["role"] == student.user.role 
    assert data["first_name"] == student.user.first_name

def test_get_authenticated_admin(authorized_admin_client):
    school, client = authorized_admin_client 
    school_id = school.id
    res = client.get("/users")
    data = res.json()

    assert data["school_id"] == school_id
    assert res.status_code == 200

def test_get_authenticated_teacher(authorized_teacher_client):
    teacher, client = authorized_teacher_client

    res = client.get("/users")
    data = res.json()

    assert res.status_code == 200
    assert data["role"] == teacher.user.role 
    assert data["first_name"] == teacher.user.first_name

