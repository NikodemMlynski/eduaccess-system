import pytest
from datetime import datetime
from app.models import AccessLog
from sqlalchemy.orm import Session
from typing import Optional

@pytest.fixture
def access_logs_factory(session: Session):
    def create_access_log(
        user_id: int,
        room_id: int,
        access_start_time: datetime,
        access_status: str,
        access_end_time: Optional[datetime] = None,
        reason: Optional[str] = None,
    ):
        access_log = AccessLog(
            user_id=user_id,
            room_id=room_id,
            access_start_time=access_start_time,
            access_end_time=access_end_time,
            access_status=access_status,
            reason=reason,
        )
        session.add(access_log)
        session.commit()
        session.refresh(access_log)
        return access_log
    return create_access_log