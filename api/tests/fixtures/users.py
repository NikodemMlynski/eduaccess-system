import pytest 
from app.models import User, Teacher, Student, Administrator
from sqlalchemy.orm import Session 
from passlib.context import CryptContext
from datetime import datetime 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FIXTURE DLA NAUCZYCIELA

def hash_password(password: str):
    return pwd_context.hash(password)

ROLE_MODELS = {
    "teacher": Teacher,
    "admin": Administrator,
    "student": Student
}

@pytest.fixture 
def user_factory(session: Session):
    def _create_user(
        role: str,
        email: str = "user@example.com",
        first_name: str = "Test",
        last_name: str = "User",
        password: str = "asdf1234",
        **kwargs
    ): 
        hashed_password = hash_password(password)
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=hashed_password,
            role=role,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        model_class = ROLE_MODELS.get(role)
        if not model_class:
            raise ValueError(f"Unsupported role: {role}")
        
        session.add(user)
        session.commit()
        session.refresh(user)

        extra_fiels = {}
        if role == "student":
            extra_fiels["class_id"] = kwargs.get("class_id", None)
        
        role_instance = model_class(user_id=user.id, **extra_fiels)
        session.add(role_instance)
        session.commit()
        session.refresh(role_instance)

        return role_instance
    return _create_user 
        

        