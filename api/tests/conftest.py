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

