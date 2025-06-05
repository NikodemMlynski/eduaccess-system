from sqlalchemy.orm import Session
from app.models import Student
from app.models import User, Class
from app.schemas import user, student
from .base_user_crud import BaseUserCRUD
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import and_


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
    
    @staticmethod 
    def assign_user_to_class(
        student_id: int,
        db: Session,
        school_id: int,
        class_id: int
    ):
        student = db.query(Student).filter(
            and_(
                Student.id == student_id,
                Student.school_id == school_id
            )
        ).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="This student does not exist"
            )
        
        class_ = db.query(Class).filter(Class.id == class_id).first()
        if not class_:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="This class does not exist"
            )

        student.class_id = class_.id
        db.commit()
        db.refresh(student)

        return student
    
    @staticmethod 
    def delete_user_from_class(
        student_id: int,
        db: Session,
        school_id: int,
        class_id
    ):
        student = db.query(Student).filter(
            and_(
                Student.school_id == school_id,
                Student.id == student_id,
                Student.class_id == class_id
            )
        ).first()

        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student does not exist or is not assigned to this class"
            )
        
        student.class_id = None 
        db.commit()
        db.refresh(student)
        return student

    @staticmethod
    def get_all_students_for_class(db: Session, school_id: int, class_id: int):
        students = db.query(Student).filter(
            and_(
                Student.school_id == school_id,
                Student.class_id == class_id
            )
        ).all()

        return students

