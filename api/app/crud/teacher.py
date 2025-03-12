from sqlalchemy.orm import Session
from app.models import Teacher
from app.models import User
from app.schemas.teacher import TeacherIn
from .. import models 
from ..schemas import teacher, user
from .base_user_crud import BaseUserCRUD

class TeachersCRUD:
    @staticmethod
    def create_teacher(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()

        if not user:   
            return None 
        
        db_teacher = Teacher(user_id=user_id)
        db.add(db_teacher)
        db.commit()
        db.refresh(db_teacher)
        return db_teacher
    
    @staticmethod
    def get_teacher(db: Session, teacher_id: int):
        return db.query(Teacher).filter(Teacher.id == teacher_id).first()
    
    @staticmethod
    def get_all_users(db: Session):
        return BaseUserCRUD.get_all_users(db, Teacher, teacher.TeacherOut)