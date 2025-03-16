from fastapi import APIRouter, Depends
from app.database import get_db
from ..crud.teacher import TeachersCRUD
from typing import List
from ..schemas import teacher
from sqlalchemy.orm import Session 

router = APIRouter(
    prefix="/teachers",
    tags=["teachers"],
)
@router.get("/", response_model=List[teacher.TeacherOut])
def get_teachers(db: Session = Depends(get_db)):    
    return TeachersCRUD.get_all_users(db)

@router.get("/{id}", response_model=teacher.TeacherOut)
def get_teacher(id: int, db: Session = Depends(get_db)):
    return TeachersCRUD.get_teacher(
        teacher_id=id,
        db=db
    )
