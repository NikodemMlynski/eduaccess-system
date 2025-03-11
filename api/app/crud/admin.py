from sqlalchemy.orm import Session
from app.models import Administrator
from app.models import User
from app.schemas.admin import AdminIn

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
    def get_all_admins(db: Session):
        return db.query(Administrator).all()