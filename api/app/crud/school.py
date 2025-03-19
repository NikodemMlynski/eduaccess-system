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
    def create_school(db: Session, school: SchoolIn, admin_id: int):
        existing_school = db.query(School).filter(School.name == school.name).first()

        if existing_school:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )
        db_school = School(
            name=school.name,
            admin_id=admin_id,
            teacher_addition_code=generate_access_code(characters),
            student_addition_code=generate_access_code(characters)
        )

        db.add(db_school)
        db.commit()
        db.refresh(db_school)
        return db_school
    
    @staticmethod
    def delete_school(db: Session, school_id: int):
        db_school = db.query(School).filter(School.id == school_id).first()
        admin_id = db_school.admin_id
        if not db_school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="School does not exist"
            )
        
        db.delete(db_school)
        db.commit()
        return admin_id
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
        print("to tutaj")
        if not school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="School with provided addition code does not exist"
            )
        print("a jednak nie")
        
        return school