import pytest
from fastapi.testclient import TestClient
from app.main import app  # Upewnij się, że importujesz FastAPI app
from app.dependencies import get_db
from sqlalchemy.orm import Session
from app.models import student
from app.database import TestingSessionLocal  # Musisz mieć testową bazę danych

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_db():
    """Tworzy testową sesję bazy danych"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_get_students(client, test_db, monkeypatch):
    def mock_get_db():
        """Mockowanie zależności get_db"""
        yield test_db

    monkeypatch.setattr("app.dependencies.get_db", mock_get_db)

    response = client.get("/students/")
    assert response.status_code == 200
    json_data = response.json()
    
    # Sprawdzamy, czy zwrócona odpowiedź to lista i czy ma długość większą niż 1
    assert isinstance(json_data, list)
    assert len(json_data) > 1
