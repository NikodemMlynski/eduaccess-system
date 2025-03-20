from sqlalchemy.orm import Session
from app.schemas.super_admin import SchoolIn, SchoolOut
from app.models import School
from fastapi import HTTPException, status
import string 
import random
from sqlalchemy import or_

characters = list(
    string.ascii_lowercase +
    string.ascii_uppercase +
    string.digits
)

def generate_access_code(characters):
    code = ""
    for i in range(25):
        code += random.choice(characters)
    return code 
    
class SchoolsCRUD:
    @staticmethod 
    def create_school(db: Session, school: SchoolIn) -> SchoolOut:
        existing_school = db.query(School).filter(School.name == school.name).first()

        if existing_school:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="School with this name already exists"
            )
        db_school = School(
            name=school.name,
            address=school.address,
            teacher_addition_code=generate_access_code(characters),
            student_addition_code=generate_access_code(characters)
        )

        db.add(db_school)
        db.commit()
        db.refresh(db_school)
        print('w schoolsCRUD')
        print(db_school)
        return db_school
    
    @staticmethod
    def delete_school(db: Session, school_id: int):
        db_school = db.query(School).filter(School.id == school_id).first()
        if not db_school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="School does not exist"
            )
        
        db.delete(db_school)
        db.commit()
    @staticmethod 
    def get_school_by_id(db: Session, school_id: int):
        school = db.query(School).filter(School.id == school_id).first()
        if not school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="School does not exist"
            )
        return school
    @staticmethod 
    def get_all_schools(db: Session):
        schools = db.query(School).all()
        return schools
    
    @staticmethod
    def get_school_by_addition_code(db: Session, addition_code: str) -> SchoolOut:
        school = db.query(School).filter(
            or_(
                School.teacher_addition_code == addition_code, 
                School.student_addition_code == addition_code
            )
            ).first()
        if not school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="School with provided addition code does not exist"
            )
        
        return school