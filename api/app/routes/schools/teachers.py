from fastapi import APIRouter, Depends
from app.database import get_db
from ...crud.teacher import TeachersCRUD
from typing import List
from ...schemas import teacher, user
from sqlalchemy.orm import Session 
from app.role_checker import admin_only
from ...oauth2 import school_checker
from ...models import User
from typing import Optional
from fastapi import Query

router = APIRouter(
    prefix="/teachers",
    tags=["teachers"],
)
@router.get("/", response_model=List[teacher.TeacherOut], dependencies=[Depends(admin_only)])
def get_teachers(
    school_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    query: Optional[str] = Query(None, description="Search by name, surname, or email"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Result limit per page"),
):
    return TeachersCRUD.get_all_teachers(
        db=db,
        school_id=school_id,
        query=query,
        page=page,
        limit=limit
    )
@router.get("/{id}", response_model=teacher.TeacherOut, dependencies=[Depends(admin_only)])
def get_teacher(school_id: int, id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return TeachersCRUD.get_teacher(
        teacher_id=id,
        db=db,
        school_id=school_id
    )

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_teacher(school_id: int, id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return TeachersCRUD.delete_teacher(
        teacher_id=id,
        db=db,
        school_id=school_id
    )

@router.put("/{id}", response_model=teacher.TeacherOut , dependencies=[Depends(admin_only)])
def update_teacher(school_id: int, id: int, data: user.UpdateUserIn, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return TeachersCRUD.update_teacher(
        data=data,
        db=db,
        teacher_id=id,
        school_id=school_id
    )