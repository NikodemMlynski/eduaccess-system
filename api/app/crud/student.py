from sqlalchemy.orm import Session
from app.models import Student
from app.models import User
from app.schemas import user, student
from .base_user_crud import BaseUserCRUD
from typing import Optional

class StudentCRUD:
    @staticmethod
    def create_student(db: Session, user_id: int, class_id: int, school_id):
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return None 
        
        db_student = Student(
            user_id=user_id,
            class_id=class_id,
            school_id=school_id
        )

        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student
    
    @staticmethod
    def get_student(db: Session, student_id: int, school_id: int):
        return BaseUserCRUD.get_user_by_id(
            db=db,
            model=Student,
            schema_out=student.StudentOut,
            user_id=student_id,
            school_id=school_id
        )
    
    @staticmethod 
    def get_all_students(db: Session, school_id: int, query: Optional[str] = None, page: int = 1, limit: int = 10):
        print(f"Next school_id: {school_id}")
        return BaseUserCRUD.get_all_users(
            db=db,
            model=Student,
            schema_out=student.StudentOut,
            school_id=school_id,
            query=query,
            page=page,
            limit=limit,
        )
    
    @staticmethod
    def delete_student(db: Session, student_id: int, school_id: int):
        return BaseUserCRUD.delete_user(
            db=db,
            model=Student,
            school_id=school_id,
            user_id=student_id
        )
    
    @staticmethod 
    def update_student(student_id: int, db: Session, school_id: int, data: user.UpdateUserIn):
        return BaseUserCRUD.update_user(
            db=db,
            model=Student,
            data=data,
            school_id=school_id,
            user_id=student_id
        )