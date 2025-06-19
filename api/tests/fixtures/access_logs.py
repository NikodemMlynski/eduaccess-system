import pytest
from datetime import datetime
from app.models import AccessLog
from sqlalchemy.orm import Session

@pytest.fixture
def access_logs_factory(session: Session):
    def create_access_log(
        user_id: int,
        room_id: int,
        access_time: datetime
    ):
        access_log = AccessLog(
            user_id=user_id,
            room_id=room_id,
            access_time=access_time
        )
        session.add(access_log)
        session.commit()
        session.refresh(access_log)
        return access_log
    return create_access_log