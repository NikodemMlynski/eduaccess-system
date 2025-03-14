from sqlalchemy.orm import Session
from ...models import User
from ...models import Student
from ...schemas.user import UserIn
from ...crud.user import UsersCRUD
from ...crud.admin import AdminsCRUD
from .base_factory import UserFactory

class AdminFactory(UserFactory):
    def create_user(self, db: Session, user_data: UserIn) -> User:
        user_data = user_data.model_copy(update={"role": "admin"})

        user = UsersCRUD.create_user(db, user_data)

        admin = AdminsCRUD.create_admin(
            db=db,
            user_id = user.id
        )
        return user