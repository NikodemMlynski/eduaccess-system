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
from app.websockets import teacher_ws
from app.websockets import user_ws
from app.websockets import open_door
from ...schemas.access_log import AccessLogIn
import requests
import asyncio

router = APIRouter(
    prefix="/access-logs",
    tags=["access-logs"]
)
#
@router.post("/request", response_model = access_log.AccessLogOut, dependencies=[Depends(student_admin)])
async def request_access_log_student(
    school_id: int,
    access_log_data: access_log.AccessLogRequestIn,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    current_user: User = Depends(get_current_user),

):
    protect(user_id=access_log_data.user_id, permitted_roles=["admin"], current_user=current_user, db=db)
    teacher_id = AccessLogsCRUD.get_teacher_for_current_lesson_instance(
        db=db,
        school_id=school_id,
        room_id=access_log_data.room_id,
        access_time=access_log_data.access_time,
    )
    new_log = AccessLogsCRUD.create_access_log(
        school_id=school_id,
        access_log_data=access_log_data,
        db=db,
    )
    print(teacher_ws.connected_teachers)
    if teacher_id in teacher_ws.connected_teachers:
        websocket = teacher_ws.connected_teachers[teacher_id]
        message = {"event": "access_log_update", "student_id": access_log_data.user_id}
        import json
        try:
            asyncio.create_task(websocket.send_text(json.dumps(message)))
        except Exception as e:
            print(f"WebSocket send failed {e}")
    if new_log.access_status == "granted":
        open_door.notify_rpi_open_door(
            db=db,
            room_id=access_log_data.room_id,
        )
    return new_log

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
    return AccessLogsCRUD.get_all_denied_access_logs_for_lesson_instance(
        db=db,
        school_id=school_id,
        user_id=user_id,
        current_time=current_time,
    )

@router.put("/handle_approval/{log_id}", dependencies=[Depends(teacher_admin)])
async def handle_access_log_approval(
    school_id: int,
    log_id: int,
    approval_data: access_log.AccessLogApproval,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    current_user: User = Depends(get_current_user),
):
    protect(user_id=approval_data.user_id, permitted_roles=["admin"], current_user=current_user, db=db)
    reviewed_access_log =  AccessLogsCRUD.approve_door_request(
        school_id=school_id,
        access_log_id=log_id,
        approval_data=approval_data,
        db=db,
        user=current_user,
    )
    status = reviewed_access_log.access_status
    reviewed_user_id = reviewed_access_log.user_id
    if status == "denied":
        AccessLogsCRUD.delete_access_log(
            db=db,
            access_log_id=log_id,
        )
    if reviewed_user_id in user_ws.connected_users:
        websocket = user_ws.connected_users[reviewed_user_id]
        message = {"event": "access_log_reviewed", "status": status}
        import json
        try:
            import asyncio
            asyncio.create_task(websocket.send_text(json.dumps(message)))
        except Exception as e:
            print(f"WebSocket send failed {e}")
    if status == "granted":
        open_door.notify_rpi_open_door()

    return reviewed_access_log

@router.post("/open_close_door", response_model = access_log.AccessLogOut, dependencies=[Depends(teacher_admin)])
async def handle_open_close_door(
        school_id: int,
        access_log_data: access_log.AccessLogIn,
        db: Session = Depends(get_db),
        school_checker: User = Depends(school_checker),
):
    open_door.notify_rpi_open_door()
    return AccessLogsCRUD.open_close_door(
        access_log_data=access_log_data,
        db=db
    )

@router.get("/", response_model=access_log.PaginatedAccessLogs ,dependencies=[Depends(admin_only)])
def get_all_access_logs(
    school_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    room_id: Optional[int] = Query(None, description="Filter by room_id"),
    start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, description="Result limit per page"),
):
    if start_date and end_date:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
    else:
        start_date = None
        end_date = None
    return AccessLogsCRUD.get_all_access_logs(
        db=db,
        school_id=school_id,
        room_id=room_id,
        start_date=start_date,
        end_date=end_date,
        page=page,
        limit=limit,
    )
@router.delete("/{access_log_id}", dependencies=[Depends(student_admin)])

def delete_access_log(
    school_id: int,
    access_log_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
    current_user: User = Depends(get_current_user),
):
    access_log = AccessLogsCRUD.get_access_log(
        db=db,
        access_log_id=access_log_id,
    )
    protect(user_id=access_log.user_id, permitted_roles=["admin"], current_user=current_user, db=db)

    return AccessLogsCRUD.delete_access_log(
        db=db,
        access_log_id=access_log_id,
    )