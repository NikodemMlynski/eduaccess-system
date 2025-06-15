from fastapi import APIRouter, Depends, Query
from app.database import get_db
import calendar
from ...crud.access_logs import AccessLogsCRUD
from ...schemas import access_log
from ...role_checker import admin_only, teacher_admin, student_admin
from app.models import User
from sqlalchemy.orm import Session
from typing import List, Optional
from ...oauth2 import school_checker, get_current_user, attendances_protect, protect
from datetime import date, datetime


router = APIRouter(
    prefix="/access-logs",
    tags=["access-logs"]
)
#
@router.post("/request", response_model = access_log.AccessLogOut, dependencies=[Depends(student_admin)])
def request_access_log_student(
    school_id: int,
    access_log_data: access_log.AccessLogIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    current_user: User = Depends(get_current_user),

):
    protect(user_id=access_log_data.user_id, permitted_roles=["admin"], current_user=current_user, db=db)
    return AccessLogsCRUD.create_access_log(
        school_id=school_id,
        access_log_data=access_log_data,
        db=db,
    )

@router.get("/request/teacher_id/{user_id}/current_time/{current_time}",
            response_model = List[access_log.AccessLogOut],
            dependencies=[Depends(teacher_admin)])
def get_all_denied_access_logs_for_teacher_actual_lesson(
    school_id: int,
    user_id: int,
    current_time: datetime,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    print(current_time)
    return AccessLogsCRUD.get_all_denied_access_logs_for_lesson_instance(
        db=db,
        school_id=school_id,
        user_id=user_id,
        current_time=current_time,
    )

@router.put("/handle_approval/{log_id}", response_model = access_log.AccessLogOut, dependencies=[Depends(teacher_admin)])
def handle_access_log_approval(
    school_id: int,
    log_id: int,
    approval_data: access_log.AccessLogApproval,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    current_user: User = Depends(get_current_user),
):
    protect(user_id=approval_data.user_id, permitted_roles=["admin"], current_user=current_user, db=db)
    return AccessLogsCRUD.approve_door_request(
        school_id=school_id,
        access_log_id=log_id,
        approval_data=approval_data,
        db=db,
    )

