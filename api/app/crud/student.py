from sqlalchemy.orm import Session
from app.models import Student
from app.models import User
from app.schemas import user, student
from .base_user_crud import BaseUserCRUD

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
    def get_all_users(db: Session, school_id):
        return BaseUserCRUD.get_all_users(
            db=db,
            model=Student,
            schema_out=student.StudentOut,
            school_id=school_id
        )
