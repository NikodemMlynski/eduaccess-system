from fastapi import APIRouter, Depends, Query
from app.database import get_db

from ...crud.attendance import AttendancesCRUD
from ...schemas import attendance
from ...role_checker import admin_only
from app.models import User
from sqlalchemy.orm import Session
from typing import List, Optional
from ...oauth2 import school_checker, get_current_user

router = APIRouter(
    prefix="/attendances",
    tags=["attendances"],
)

@router.post("/", response_model=attendance.AttendanceOut, dependencies=[Depends(admin_only)])
def create_attendance(
        school_id: int,
        attendance_data: attendance.AttendanceIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
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

@router.put("/{id}", response_model=attendance.AttendanceOut, dependencies=[Depends(admin_only)])
def update_attendance(
        school_id: int,
        attendance_data: attendance.AttendanceIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    return AttendancesCRUD.update_attendance(
        db=db,
        id=id,
        attendance_data=attendance_data,
    )