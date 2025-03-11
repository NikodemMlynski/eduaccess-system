from sqlalchemy.orm import Session
from app.models import Student
from app.models import User
from app.schemas.student import StudentIn

class StudentCRUD:
    @staticmethod
    def create_student(db: Session, user_id: int, class_id: int):
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return None 
        
        db_student = Student(
            user_id=user_id,
            class_id=class_id
        )

        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student
    
