from fastapi import APIRouter, Depends
from app.database import get_db
from ...crud.teacher import TeachersCRUD
from typing import List
from ...schemas import teacher
from sqlalchemy.orm import Session 
from app.role_checker import admin_only

router = APIRouter(
    prefix="/teachers",
    tags=["teachers"],
)
@router.get("/", response_model=List[teacher.TeacherOut], dependencies=[Depends(admin_only)])
def get_teachers(school_id: int, db: Session = Depends(get_db)):    
    return TeachersCRUD.get_all_users(db, school_id=school_id)

@router.get("/{id}", response_model=teacher.TeacherOut, dependencies=[Depends(admin_only)])
def get_teacher(school_id: int, id: int, db: Session = Depends(get_db)):
    return TeachersCRUD.get_teacher(
        teacher_id=id,
        db=db,
        school_id=school_id
    )
