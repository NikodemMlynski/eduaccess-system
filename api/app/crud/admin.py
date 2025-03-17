from sqlalchemy.orm import Session
from app.models import Administrator
from app.models import User, Administrator
from app.schemas import admin
from .base_user_crud import BaseUserCRUD

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
    def get_all_users(db: Session):
        return BaseUserCRUD.get_all_users(db, Administrator, admin.AdminOut)
    
    @staticmethod
    def get_admin(db: Session, admin_id: int):
        return BaseUserCRUD.get_user_by_id(db, Administrator, admin.AdminOut, admin_id)