from sqlalchemy.orm import Session
from app.models import User
from app.models import Student
from ...schemas.student import UserStudentIn
from ...crud.user import UsersCRUD
# from ..crud.student import StudentCRUD
from ...crud.student import StudentCRUD
from .base_factory import UserFactory

class StudentFactory(UserFactory):
    def create_user(self, db: Session, user_data: UserStudentIn) -> User:
        user_data = user_data.model_copy(update={"role": "student"})
        user = UsersCRUD.create_user(db, user_data)
        student = StudentCRUD.create_student(
            db=db,
            class_id=user_data.class_id,
            user_id=user.id,
            school_id=user_data.school_id
        )
        return user