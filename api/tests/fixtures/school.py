import pytest
from app.models import User, Administrator, School
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime
from app.crud.school import generate_access_code, characters 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

@pytest.fixture
def school_admin_factory(session: Session):
    def _create_school_with_admin(
        school_name: str = "Test School",
        school_address: str = "123 Test St",
        admin_email: str = "admin@example.com",
        admin_first_name: str = "Admin",
        admin_last_name: str = "User",
        admin_password: str = "admin1234"
    ):
        existing_school = session.query(School).filter(School.name == school_name).first()

        if existing_school:
            return None

        db_school = School(
            name=school_name,
            address=school_address,
            teacher_addition_code=generate_access_code(characters),
            student_addition_code=generate_access_code(characters),
        )
        session.add(db_school)
        session.commit()
        session.refresh(db_school)

        hashed_password = hash_password(admin_password)
        admin_user = User(
            first_name=admin_first_name,
            last_name=admin_last_name,
            email=admin_email,
            password=hashed_password,
            role="admin",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            school_id=db_school.id
        )
        session.add(admin_user)
        session.commit()
        session.refresh(admin_user)

        db_admin = Administrator(user_id=admin_user.id)
        session.add(db_admin)
        session.commit()
        session.refresh(db_admin)

        return db_school, admin_user, db_admin

    return _create_school_with_admin