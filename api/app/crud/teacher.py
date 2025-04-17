from sqlalchemy.orm import Session
from app.models import Teacher
from app.models import User
from app.schemas.teacher import TeacherIn
from .. import models 
from ..schemas import teacher, user
from .base_user_crud import BaseUserCRUD
from fastapi import HTTPException, status
from typing import Optional
from .user import UsersCRUD

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
    def get_teacher(db: Session, teacher_id: int, school_id: int):
        return BaseUserCRUD.get_user_by_id(
            db=db,
            model=Teacher,
            schema_out=teacher.TeacherOut,
            user_id=teacher_id,
            school_id=school_id
            )
    
    @staticmethod
    def get_all_teachers(db: Session, school_id: int, query: Optional[str] = None, page: int = 1, limit: int = 10):
        return BaseUserCRUD.get_all_users(
            db=db,
            model=Teacher,
            schema_out=teacher.TeacherOut,
            school_id=school_id,
            query=query,
            page=page,
            limit=limit
        )
    @staticmethod 
    def delete_teacher(db: Session, teacher_id: int, school_id: int):
        return BaseUserCRUD.delete_user(
            db=db,
            model=Teacher,
            school_id=school_id,
            user_id=teacher_id
        )
    
    @staticmethod
    def update_teacher(teacher_id: int, db: Session, school_id: int, data: user.UpdateUserIn):
        return BaseUserCRUD.update_user(
            db=db,
            model=Teacher,
            data=data,
            school_id=school_id,
            user_id=teacher_id
            
        )
        # def update_user(db: Session, model, user_id: int, school_id: int, data: user.UpdateUserIn):
        