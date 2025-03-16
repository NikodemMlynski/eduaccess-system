from sqlalchemy.orm import Session
from app.models import User
from app.schemas import user
from fastapi import HTTPException, status

class BaseUserCRUD:
    @staticmethod
    def get_all_users(db: Session, model, schema_out):
        users = db.query(model, User).join(User, model.user_id == User.id).all()

        return [
            schema_out(
                id=m.id,
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

    @staticmethod 
    def get_user_by_id(db: Session, model, schema_out, user_id: int):
        result = db.query(model, User).join(User, model.user_id == User.id).filter(model.id == user_id).first()

        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        m, u = result 

        return schema_out(
            id=m.id,
            **({"class_id": m.class_id} if hasattr(m, "class_id") else {}),
            user=user.UserOut(
                id=u.id,
                first_name=u.first_name,
                last_name=u.last_name,
                email=u.email,
                role=u.role,
                created_at=u.created_at,
                updated_at=u.updated_at
            )
        )