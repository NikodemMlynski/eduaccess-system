from fastapi import APIRouter, Depends
from app.database import get_db
from ...crud.student import StudentCRUD
from typing import List
from ...schemas import student, user, utils
from sqlalchemy.orm import Session 
from app.role_checker import admin_only
from ...oauth2 import school_checker, get_current_user, protect
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

@router.get("/class_id/{class_id}", response_model=List[student.StudentOut], dependencies=[Depends(admin_only)])
def get_all_students_for_class(
        school_id: int,
        class_id: int,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker)
):
    return StudentCRUD.get_all_students_for_class(
        db=db,
        school_id=school_id,
        class_id=class_id,
    )

@router.get("/{id}", response_model=student.StudentOut, dependencies=[Depends(admin_only)])
def get_student(school_id: int, id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return StudentCRUD.get_student(
        db=db,
        school_id=school_id,
        student_id=id,
    )

@router.get("/user_id/{id}", response_model=student.StudentOutWithClass)
def get_student_by_user_id(
        school_id: int,
        id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        school_checker: User = Depends(school_checker)
):
    protect(user_id=id, permitted_roles=["admin", "teacher"], current_user=current_user, db=db)
    return StudentCRUD.get_student_by_user_id(
        db=db,
        school_id=school_id,
        user_id=id,
    )
@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_student(school_id: int, id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return StudentCRUD.delete_student(
        student_id=id,
        db=db,
        school_id=school_id
    )

@router.put("/{id}", response_model=student.StudentOut , dependencies=[Depends(admin_only)])
def update_student(school_id: int, id: int, data: user.UpdateUserIn, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return StudentCRUD.update_student(
        data=data,
        db=db,
        student_id=id,
        school_id=school_id
    )

@router.put("/{id}/classes/{class_id}", response_model=student.StudentOut, dependencies=[Depends(admin_only)])
def assign_user_to_class(
    school_id: int,
id: int,
    class_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return StudentCRUD.assign_user_to_class(
        student_id=id,
        db=db,
        school_id=school_id,
        class_id=class_id
    )


@router.delete("/{id}/classes/{class_id}", response_model=student.StudentOut, dependencies=[Depends(admin_only)])
def delete_user_from_class(
    school_id: int,
    id: int,
    class_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return StudentCRUD.delete_user_from_class(
        student_id=id,
        school_id=school_id,
        db=db,
        class_id=class_id
    )