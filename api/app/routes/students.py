from fastapi import APIRouter, Depends
from app.database import get_db
from ..crud.student import StudentCRUD
from typing import List
from ..schemas import student
from sqlalchemy.orm import Session 

router = APIRouter(
    prefix="/students",
    tags=["students"],
)
@router.get("/", response_model=List[student.StudentOut])
def get_students(db: Session = Depends(get_db)):    

    return StudentCRUD.get_all_users(db)

@router.get("/{id}", response_model=student.StudentOut)
def get_student(id: int, db: Session = Depends(get_db)):
    return StudentCRUD.get_student(
        db=db,
        student_id=id
    )