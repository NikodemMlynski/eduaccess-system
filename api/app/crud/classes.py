from sqlalchemy.orm import Session 
from app.models import Class
from app.schemas import class_ 
from fastapi import HTTPException, status
from sqlalchemy import and_

def check_class_name_correct(s):
    return (
        len(s) == 2 and 
        s[0] in '12345678' and 
        s[1].isalpha() and
        s[1].isupper()
    )

class ClassesCRUD:
    @staticmethod 
    def create_class(db: Session, school_id: int, class_data: class_.ClassIn):
        class_ = db.query(Class).filter(
            and_(
                Class.class_name == class_data.class_name,
                Class.school_id == school_id
            )
        ).first()

        if class_:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"class with name: {class_data.class_name} already exisists"
            )
        
        if not check_class_name_correct(class_data.class_name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid class name"
            )
            
        db_class = Class(
            class_name= class_data.class_name,
            school_id=school_id
        )

        db.add(db_class)
        db.commit()
        db.refresh(db_class)
        return db_class
    
    @staticmethod 
    def get_all_classes(db: Session, school_id: int):
        classes = db.query(Class).filter(Class.school_id == school_id).all()
        return classes
    
    @staticmethod
    def get_class_by_id(db: Session, school_id: int, id: int):
        class_ = db.query(Class).filter(
            and_(
                Class.school_id == school_id,
                Class.id == id,
            )
        ).first()

        if not class_:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="This class does not exist in this school"
            )
        
        return class_
    
    @staticmethod 
    def get_all_classes_by_year(db: Session, school_id: int, class_year: int):
        if str(class_year) not in "12345678":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid class year. Must be between 1 and 8."
            )
        
        pattern = f"{class_year}%"  # np. "3%" – SQL LIKE pattern

        classes = db.query(Class).filter(
            and_(
                Class.school_id == school_id,
                Class.class_name.like(pattern)
            )
        ).all()

        return classes

    @staticmethod
    def delete_class(db: Session, school_id: int, id: int):
        class_ = db.query(Class).filter(
            and_(
                Class.school_id == school_id,
                Class.id == id
            )
        ).first()

        if not class_:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Class not found"
            )

        db.delete(class_)
        db.commit()
        return {"detail": "Class deleted successfully"}
