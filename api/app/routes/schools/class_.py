from fastapi import APIRouter, Depends 
from app.database import get_db 
from ...crud.classes import ClassesCRUD
from ...schemas import class_
from ...role_checker import admin_only
from app.models import User 
from sqlalchemy.orm import Session 
from typing import List
from ...oauth2 import school_checker, get_current_user

router = APIRouter(
    prefix="/classes",
    tags=["classes"]
)

@router.post("/", response_model=class_.ClassOut, dependencies=[Depends(admin_only)])
def create_class(
    school_id: int,
    class_data: class_.ClassIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return ClassesCRUD.create_class(
        db=db,
        school_id=school_id,
        class_data=class_data
    )

@router.get("/", response_model=List[class_.ClassOut], dependencies=[Depends(admin_only)])
def get_all_classes(
    school_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return ClassesCRUD.get_all_classes(
        db=db,
        school_id=school_id
    )

@router.get("/{id}", response_model=class_.ClassOut, dependencies=[Depends(admin_only)])
def get_class_by_id(
    school_id: int,
    id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return ClassesCRUD.get_class_by_id(
        db=db,
        school_id=school_id,
        id=id
    )

@router.get("/class_year/{class_year}", response_model=List[class_.ClassOut], dependencies=[Depends(admin_only)])
def get_classes_by_year(
    school_id: int,
    class_year: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return ClassesCRUD.get_all_classes_by_year(
        db=db,
        school_id=school_id,
        class_year=class_year
    )

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_class(
    school_id: int,
    id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return ClassesCRUD.delete_class(
        db=db,
        school_id=school_id,
        id=id
    )
