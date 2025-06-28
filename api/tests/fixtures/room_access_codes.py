import pytest
from app.models import Room, RoomAccessCodes
from datetime import datetime
from sqlalchemy.orm import Session
from app.utils import generate_4_letter_code


@pytest.fixture
def room_access_codes_factory(session: Session):
    def create_room_access_code(room_id: int):
        generated_code = generate_4_letter_code()
        room_access_code = RoomAccessCodes(
            access_code=generated_code,
            room_id=room_id,
        )
        session.add(room_access_code)
        session.commit()
        session.refresh(room_access_code)
        return room_access_code
    return create_room_access_code
