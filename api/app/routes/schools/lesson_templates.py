from fastapi import APIRouter, Depends
from app.database import get_db
from ...crud.lesson_template import LessonTemplatesCRUD

from typing import List
from ...schemas import lesson_template, utils, lesson_instance
from sqlalchemy.orm import Session
from app.role_checker import admin_only
from ...oauth2 import school_checker
from ...models import User

router = APIRouter(
    prefix="/lesson_templates",
    tags=["lesson_templates"],
)

@router.post("/", response_model=lesson_template.LessonTemplateOut, dependencies=[Depends(admin_only)])
def create_lesson_template(
    school_id: int,
    lesson_template_data: lesson_template.LessonTemplateIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return LessonTemplatesCRUD.create_lesson_template(
        db=db,
        lesson_template_data=lesson_template_data
    )

@router.get("/classes/{class_id}", response_model=List[lesson_template.LessonTemplateOut], dependencies=[Depends(admin_only)])
def get_all_lesson_templates_by_class_id(
    school_id: int,
    class_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    return LessonTemplatesCRUD.get_all_lesson_templates_for_class(
        db=db,
        class_id=class_id
    )

@router.get("/rooms/{room_id}", response_model=List[lesson_template.LessonTemplateOut], dependencies=[Depends(admin_only)])
def get_all_lesson_templates_by_room_id(
    school_id: int,
    room_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    return LessonTemplatesCRUD.get_all_lesson_templates_for_room(
        db=db,
        room_id=room_id
    )

@router.get("/teachers/{teacher_id}", response_model=List[lesson_template.LessonTemplateOut], dependencies=[Depends(admin_only)])
def get_all_lesson_templates_by_teacher_id(
    school_id: int,
    teacher_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    return LessonTemplatesCRUD.get_all_lesson_templates_for_teacher(
        db=db,
        teacher_id=teacher_id
    )

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_lesson_template(
    school_id: int,
    id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return LessonTemplatesCRUD.delete_lesson_template(
        db=db,
        id=id
    )

@router.put("/{id}", response_model=lesson_template.LessonTemplateOut, dependencies=[Depends(admin_only)])
def update_lesson_template(
    school_id: int,
    id: int,
    lesson_template_data: lesson_template.LessonTemplateIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return LessonTemplatesCRUD.update_lesson_template(
        db=db,
        id=id,
        lesson_template_update_data=lesson_template_data
    )