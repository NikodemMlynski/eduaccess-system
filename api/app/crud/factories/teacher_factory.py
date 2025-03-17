from sqlalchemy.orm import Session
from ...models import User
from ...models import Student
from ...schemas.user import UserIn
from ...crud.user import UsersCRUD
from ...crud.teacher import TeachersCRUD
from .base_factory import UserFactory

class TeacherFactory(UserFactory):
    def create_user(self, db: Session, user_data: UserIn) -> User:
        user_data = user_data.model_copy(update={"role": "teacher"})

        user = UsersCRUD.create_user(db, user_data)

        teacher = TeachersCRUD.create_teacher(
            db=db,
            user_id=user.id
        )
        return user