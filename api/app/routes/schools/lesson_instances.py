from fastapi import APIRouter, Depends,HTTPException, status
from app.database import get_db
from ...crud.lesson_instance import LessonInstancesCRUD
from typing import List
from ...schemas import lesson_instance
from sqlalchemy.orm import Session
from app.role_checker import admin_only, teacher_admin
from ...oauth2 import school_checker, class_protect, get_current_user
from ...models import User
from app import utils

router = APIRouter(
    prefix="/lesson_instances",
    tags=["lesson_instances"],
)

@router.post("/generate/weeks_ahead/{weeks_ahead}",  response_model=List[lesson_instance.LessonInstanceOut], dependencies=[Depends(admin_only)])
def generate_lessons_from_template(
        school_id: int,
        db: Session = Depends(get_db),
        weeks_ahead: int = 0,
        school_checker: User = Depends(school_checker),
):
    return LessonInstancesCRUD.generate_lessons_from_lesson_template_for_week(
        school_id=school_id,
        db=db,
        weeks_ahead=weeks_ahead,
    )

@router.post("/", response_model=lesson_instance.LessonInstanceOut, dependencies=[Depends(admin_only)])
def create_lesson_instance(
    school_id: int,
    lesson_instance_data: lesson_instance.LessonInstanceIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return LessonInstancesCRUD.create_lesson_instance(
        db=db,
        lesson_instance_data=lesson_instance_data
    )

@router.get("/classes/{class_id}", response_model=List[lesson_instance.LessonInstanceOut])
def get_all_lesson_instances_by_class_id(
    school_id: int,
    class_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    current_user: User = Depends(get_current_user),
    date: str = Depends(utils.validate_date)
):
    class_protect(
        class_id=class_id,
        permitted_roles=["teacher", "admin"],
        current_user=current_user,
        db=db,
    )
    return LessonInstancesCRUD.get_all_lesson_instances_for_class(
        db=db,
        class_id=class_id,
        date=date
    )

@router.get("/rooms/{room_id}", response_model=List[lesson_instance.LessonInstanceOut], dependencies=[Depends(admin_only)])
def get_all_lesson_instances_by_room_id(
    school_id: int,
    room_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    date: str = Depends(utils.validate_date)
):
    return LessonInstancesCRUD.get_all_lesson_instances_for_room(
        db=db,
        room_id=room_id,
        date=date
    )

@router.get("/teachers/{teacher_id}", response_model=List[lesson_instance.LessonInstanceOut])
def get_all_lesson_instances_by_teacher_id(
    school_id: int,
    teacher_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    date: str = Depends(utils.validate_date)
):
    return LessonInstancesCRUD.get_all_lesson_instances_for_teacher(
        db=db,
        teacher_id=teacher_id,
        date=date
    )

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_lesson_instance(
    school_id: int,
    id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return LessonInstancesCRUD.delete_lesson_instance(
        db=db,
        id=id
    )

@router.put("/{id}", response_model=lesson_instance.LessonInstanceOut, dependencies=[Depends(admin_only)])
def update_lesson_instance(
    school_id: int,
    id: int,
    lesson_instance_data: lesson_instance.LessonInstanceIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker)
):
    return LessonInstancesCRUD.update_lesson_instance(
        db=db,
        id=id,
        lesson_instance_update_data=lesson_instance_data
    )

@router.post("/classes/{class_id}/current", response_model=lesson_instance.LessonInstanceOut)
def get_current_lesson_instance_for_class(
        school_id: int,
        class_id: int,
        current_time_obj: lesson_instance.CurrentTimeIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker)
):
    lesson_instance =  LessonInstancesCRUD.get_current_lesson_instance_for_class_or_teacher(
        db=db,
        class_id=class_id,
        school_id=school_id,
        current_time=current_time_obj.current_time
    )
    if not lesson_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Currently there is no lesson for given class"
        )
    return lesson_instance