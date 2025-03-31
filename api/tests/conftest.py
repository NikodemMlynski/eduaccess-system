from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings 
from app.database import get_db, Base 
import pytest 
from fastapi.testclient import TestClient 
from app.main import app
from app.oauth2 import create_access_token
from app import models 
from .fixtures.users import user_factory
from .fixtures.school import school_admin_factory

SQLALCHEMY_DATABASE_URL = settings.test_database_url

engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def client(session):
    def override_get_db():
        try:
            yield session 
        finally:
            session.close()
    app.dependency_overrides[get_db] = override_get_db
    
    yield TestClient(app)


@pytest.fixture
def test_school_and_admin(client, school_admin_factory):
    school, admin_user, _ = school_admin_factory()

    return school, admin_user

@pytest.fixture()
def admin_token(test_school_and_admin):
    school, test_admin = test_school_and_admin
    return school, create_access_token({"user_id": test_admin.id, "role": test_admin.role})

@pytest.fixture 
def authorized_admin_client(client, admin_token):
    school, token = admin_token
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    return school, client 

@pytest.fixture 
def test_student(client, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id
    student = user_factory(role="student", school_id=school_id, email="student@example.com")
    return student

@pytest.fixture 
def student_token(test_student):
    student = test_student 
    return student, create_access_token({"user_id": student.user.id, "role": student.user.role})

@pytest.fixture 
def authorized_student_client(client, student_token):
    student, token = student_token
    client.headers.clear()
    client.headers.update({
        "Authorization": f"Bearer {token}"
    })
    return student, client 

@pytest.fixture 
def test_teacher(client, school_admin_factory, user_factory):
    school, _, _ = school_admin_factory()
    school_id = school.id 
    teacher = user_factory(role="teacher", school_id=school_id, email="teacher@example.com")
    return teacher

@pytest.fixture 
def teacher_token(test_teacher):
    teacher = test_teacher 
    return teacher, create_access_token({"user_id": teacher.user.id, "role": teacher.user.role})

@pytest.fixture 
def authorized_teacher_client(client, teacher_token):
    teacher, token = teacher_token 
    client.headers.clear()
    client.headers.update({
        "Authorization": f"Bearer {token}"
    })
    return teacher, client