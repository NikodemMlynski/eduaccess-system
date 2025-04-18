from fastapi import APIRouter, Depends
from app.database import get_db
from ...crud.student import StudentCRUD
from typing import List
from ...schemas import student, user, utils
from sqlalchemy.orm import Session 
from app.role_checker import admin_only
from ...oauth2 import school_checker, get_current_user
from ...models import User
from typing import Optional
from fastapi import Query

router = APIRouter(
    prefix="/students",
    tags=["students"],
)
# , response_model=List[student.StudentOut]
@router.get("/", response_model=utils.PaginatedResponse[student.StudentOut], dependencies=[Depends(admin_only)])
def get_students(
    school_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    query: Optional[str] = Query(None, description="Search by name, surname or email"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Result lilmit per page")
):
    print(f"School id: {school_id}")
    return StudentCRUD.get_all_students(
        db=db,
        school_id=school_id,
        query=query,
        page=page,
        limit=limit,
    )

@router.get("/{id}", response_model=student.StudentOut, dependencies=[Depends(admin_only)])
def get_student(school_id: int, id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return StudentCRUD.get_student(
        db=db,
        school_id=school_id,
        student_id=id,
    )

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_teacher(school_id: int, id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return StudentCRUD.delete_student(
        student_id=id,
        db=db,
        school_id=school_id
    )

@router.put("/{id}", response_model=student.StudentOut , dependencies=[Depends(admin_only)])
def update_teacher(school_id: int, id: int, data: user.UpdateUserIn, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return StudentCRUD.update_student(
        data=data,
        db=db,
        student_id=id,
        school_id=school_id
    )