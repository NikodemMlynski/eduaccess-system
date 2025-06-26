from fastapi import APIRouter, Depends, Query
from app.database import get_db
import calendar
from ...crud.attendance import AttendancesCRUD
from ...crud.teacher import TeachersCRUD
from ...schemas import attendance
from ...role_checker import admin_only, teacher_admin
from app.models import User
from sqlalchemy.orm import Session
from typing import List, Optional
from ...oauth2 import school_checker, get_current_user, attendances_protect, protect
from datetime import date
from app import utils
router = APIRouter(
    prefix="/attendances",
    tags=["attendances"],
)

@router.get("/classes/{class_id}/day/{day}", response_model=List[attendance.IAttendanceRaw], dependencies=[Depends(teacher_admin)] )
def get_class_attendance_by_day(
    school_id: int,
    class_id: int,
    day: date,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    return AttendancesCRUD.get_class_attendance_by_day(db=db, class_id=class_id, day=day)

@router.get("/student/{student_id}/day/{day}"
    , response_model=List[attendance.AttendanceOut]
            )
def get_student_attendance_by_day(
    school_id: int,
    student_id: int,
    day: date,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    return AttendancesCRUD.get_student_attendance_by_day(db=db, student_id=student_id, day=day)

@router.get("/student/{student_id}/stats",
            response_model=List[attendance.StudentAttendanceStatsOut]
            )
def get_student_attendance_stats_by_subject(
    school_id: int,
    student_id: int,
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    today = date.today()

    if not date_to or not date_from:
        date_from = today.replace(day=1)
        last_day = calendar.monthrange(today.year, today.month)[1]
        date_to = today.replace(day=last_day)


    return AttendancesCRUD.get_student_attendance_stats_by_subject(
            db=db,
            student_id=student_id,
            date_from=date_from,
            date_to=date_to,
        )
@router.post("/", response_model=attendance.AttendanceOut)
def create_attendance(
        school_id: int,
        attendance_data: attendance.AttendanceIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
        current_user: User = Depends(get_current_user)
):
    # lesson_id: 288
    # w@sienko.com
    # student_id: 13
    attendances_protect(
        current_user=current_user,
        permitted_roles=["admin"],
        lesson_instance_id=attendance_data.lesson_id,
        db=db
    )
    return AttendancesCRUD.create_attendance(
        db=db,
        attendance_data=attendance_data,
    )

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_attendance(
        school_id: int,
        id: int,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return AttendancesCRUD.delete_attendance(
        db=db,
        id=id,
    )

@router.put("/{attendance_id}", response_model=attendance.AttendanceOut)
def update_attendance(
        school_id: int,
        attendance_id: int,
        attendance_data: attendance.AttendanceIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
        current_user: User = Depends(get_current_user)
):
    attendances_protect(
        current_user=current_user,
        permitted_roles=["admin"],
        lesson_instance_id=attendance_data.lesson_id,
        db=db
    )
    return AttendancesCRUD.update_attendance(
        db=db,
        attendance_id=attendance_id,
        attendance_data=attendance_data,
    )

@router.get("/teacher/{teacher_id}", response_model=List[attendance.AttendanceCompact], dependencies=[Depends(teacher_admin)])
def get_attendances_for_day_by_teacher(
        school_id: int,
        teacher_id: int,
        date: str = Depends(utils.validate_date),
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
        current_user: User = Depends(get_current_user)
):
    teacher = TeachersCRUD.get_teacher(db=db, teacher_id=teacher_id, school_id=school_id)

    protect(user_id=teacher.user.id, permitted_roles=["admin"], current_user=current_user, db=db)

    return AttendancesCRUD.get_attendances_for_day_by_teacher(
        db=db,
        teacher_id=teacher_id,
        day=date,
    )