import pytest 
from app.models import User, Class, Student 
from app.schemas import class_
from sqlalchemy.orm import Session 
from datetime import datetime 

@pytest.fixture 
def classes_factory(session: Session):
    def _create_class(
        class_name: str,
        school_id: str,
    ):
        class_ = Class(
            class_name=class_name,
            school_id=school_id
        )
        session.add(class_)
        session.commit()
        session.refresh(class_)

        return class_ 
    return _create_class