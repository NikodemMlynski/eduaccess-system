from sqlalchemy.orm import Session
from app.models import Administrator
from app.models import User, Administrator
from app.schemas import admin
from .base_user_crud import BaseUserCRUD
from fastapi import HTTPException, status
from .user import UsersCRUD
from sqlalchemy import and_
class AdminsCRUD:
    @staticmethod 
    def create_admin(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return None 
        print(user.__dict__)
        
        db_admin = Administrator(user_id=user.id)
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)
        return db_admin
    
    @staticmethod
    def get_all_users(db: Session, school_id: int):
        return BaseUserCRUD.get_all_users(db, Administrator, admin.AdminOut, school_id)
    
    @staticmethod
    def get_admin(db: Session, admin_id: int):
        return BaseUserCRUD.get_user_by_id(db, Administrator, admin.AdminOut, admin_id)
    
    @staticmethod
    def delete_admin(db: Session, admin_id: int):
        existing_admin = db.query(Administrator).filter(Administrator.id == admin_id).first()
        user_id = existing_admin.user_id

        if not existing_admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="School does not exist"
            )

        db.delete(existing_admin)
        db.commit()
        UsersCRUD.delete_user(db=db, user_id=user_id)
        
    @staticmethod
    def get_admin_by_school_id(db: Session, school_id: int):
        user = db.query(User).filter(
            and_(
                User.role == "admin",
                User.school_id == school_id,
            )
        ).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Admin associated with the school is missing. Database integrity error."
            )
        user = BaseUserCRUD.get_user_by_id(db, Administrator, admin.AdminOut, user.id, school_id); 
        return user
