from sqlalchemy.orm import Session
from app.models import User
from app.schemas import user
from fastapi import HTTPException, status
from sqlalchemy import and_ 
from typing import Optional
from datetime import datetime
from sqlalchemy import or_

class BaseUserCRUD:
    @staticmethod
    def get_all_users(
        db: Session, 
        model, 
        schema_out, 
        school_id: int,
        query: Optional[str] = None,
        page: int = 1,
        limit: int = 10
        ):
        base_query = db.query(model, User).join(User, model.user_id == User.id) \
        .filter(User.school_id == school_id)

        if query:
            search = f"%{query.lower()}%"
            base_query = base_query.filter(
                or_(
                    User.first_name.ilike(search),
                    User.last_name.ilike(search),
                    User.email.ilike(search)
                )
            )
        
        users = base_query.offset((page - 1) * limit).limit(limit).all()

        has_next = base_query.offset(page * limit).limit(1).all()
        has_next_page = len(has_next) > 0

        total_count = base_query.count()

        return {
            "has_next_page": has_next_page,
            "total_count": total_count,
            "users":[
            schema_out(
                id=m.id,
                **({"class_id": m.class_id} if hasattr(m, "class_id") else {}),
                **({"school_id": m.school_id} if hasattr(m, "school_id") else {}),
                user=user.UserOut(
                    id=u.id,
                    **({"school_id": u.school_id} if hasattr(u, "school_id") else {}),
                    first_name=u.first_name,
                    last_name=u.last_name,
                    email=u.email,
                    role=u.role,
                    created_at=u.created_at,
                    updated_at=u.updated_at
                )
            ) for m, u in users
        ]}
        

    @staticmethod 
    def get_user_by_id(db: Session, model, schema_out, user_id: int, school_id: int):
        result = db.query(model, User).join(User, model.user_id == User.id).filter(
            and_(
            model.id == user_id,
            User.school_id == school_id
            )).first()

        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        m, u = result 

        return schema_out(
            id=m.id,
            **({"class_id": m.class_id} if hasattr(m, "class_id") else {}),
            **({"school_id": m.school_id} if hasattr(m, "school_id") else {}),
            user=user.UserOut(
                id=u.id,
                **({"school_id": u.school_id} if hasattr(u, "school_id") else {}),
                first_name=u.first_name,
                last_name=u.last_name,
                email=u.email,
                role=u.role,
                created_at=u.created_at,
                updated_at=u.updated_at
            )
        )
    
    @staticmethod
    def update_user(db: Session, model, user_id: int, school_id: int, data: user.UpdateUserIn):
        result = db.query(model, User).join(User, model.user_id == User.id).filter(
            and_(
                model.id == user_id,
                User.school_id == school_id
            )
        ).first()

        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        m, u = result

        u.first_name = data.first_name
        u.last_name = data.last_name
        u.email = data.email
        u.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(u)
        db.refresh(m)

        return m

    @staticmethod
    def delete_user(db: Session, model, user_id: int, school_id: int):
        result = db.query(model, User).join(User, model.user_id == User.id).filter(
            and_(
                model.id == user_id,
                User.school_id == school_id
            )
        ).first()

        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        m, u = result

        db.delete(m)  
        db.delete(u) 
        db.commit()

        return {"message": "User deleted successfully"}
