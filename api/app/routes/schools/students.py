from fastapi import APIRouter, Depends
from app.database import get_db
from ...crud.student import StudentCRUD
from typing import List
from ...schemas import student
from sqlalchemy.orm import Session 
from app.role_checker import admin_only
from ...oauth2 import school_checker, get_current_user
from ...models import User

router = APIRouter(
    prefix="/students",
    tags=["students"],
)
@router.get("/", response_model=List[student.StudentOut], dependencies=[Depends(admin_only)])
def get_students(school_id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)): 
    return StudentCRUD.get_all_users(
        db=db,
        school_id=school_id
    )

@router.get("/{id}", response_model=student.StudentOut, dependencies=[Depends(admin_only)])
def get_student(school_id: int, id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return StudentCRUD.get_student(
        db=db,
        student_id=id,
        school_id=school_id
    )