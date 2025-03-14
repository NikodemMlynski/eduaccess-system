from sqlalchemy.orm import Session
from app.models import User
from app.schemas import user

class BaseUserCRUD:
    @staticmethod
    def get_all_users(db: Session, model, schema_out):
        users = db.query(model, User).join(User, model.user_id == User.id).all()

        return [
            schema_out(
                id=m.id,
                created_at=m.created_at,
                updated_at=m.updated_at,
                **({"class_id": m.class_id} if hasattr(m, "class_id") else {}),
                user=user.UserOut(
                    id=u.id,
                    first_name=u.first_name,
                    last_name=u.last_name,
                    email=u.email,
                    role=u.role,
                    created_at=u.created_at,
                    updated_at=u.updated_at,
                )
            ) for m, u in users
        ]