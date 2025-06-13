from app.schemas import attendance, access_log
from app.models import Attendance, Student, LessonInstance
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, case, func
from typing import Optional
from datetime import datetime, time

from app.crud.lesson_instance import LessonInstancesCRUD
from app.crud.student import StudentCRUD

from api.app.models import AccessLog


class AccessLogsCRUD:
    @staticmethod
    def create_access_log(
        db: Session,
        school_id: int,
        access_log_data: access_log.AccessLogIn
    ):
        is_student_permitted = AccessLogsCRUD.check_if_student_have_lesson_in_room(
            db=db,
            school_id=school_id,
            user_id=access_log_data.user_id,
            room_id=access_log_data.room_id,
            access_time=access_log_data.access_time,
        )
        if is_student_permitted:
            db_access_log = AccessLog(
                user_id=access_log_data.user_id,
                room_id=access_log_data.room_id,
                access_start_time=access_log_data.access_time,
                reason="Student currently have lesson in this room.",
                access_status="granted"
            )
        else:
            db_access_log = AccessLog(
                user_id=access_log_data.user_id,
                room_id=access_log_data.room_id,
                access_start_time=access_log_data.access_time,
                reason="Student currently do not have lesson in this room.",
                access_status="denied"
            )
        db.add(db_access_log)
        db.commit()
        db.refresh(db_access_log)
        return db_access_log

    @staticmethod
    def update_access_log(
            db: Session,
            access_log_id: int,
            access_log_data: access_log.AccessLogIn,
    ):
        access_log = db.query(AccessLog).filter(
            AccessLog.id == access_log_id
        ).first()

        if not access_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"The access log with id {access_log_id} does not exist."
            )

        access_log.user_id = access_log_data.user_id
        access_log.room_id = access_log_data.room_id
        access_log.access_start_time = access_log_data.access_start_time
        access_log.access_end_time = access_log_data.access_end_time
        access_log.access_status = access_log_data.access_status
        access_log.reason = access_log_data.reason

        db.commit()
        db.refresh(access_log)
        return access_log

    @staticmethod
    def check_if_unclosed_access_log_exists(
            db: Session,
            user_id: int,
            room_id: int,
    ):
        pass

    @staticmethod
    def check_if_student_have_lesson_in_room(
            db: Session,
            school_id: int,
            user_id: int,
            room_id: int,
            access_time: datetime,
    ):
        student = StudentCRUD.get_student_by_user_id(
            db=db,
            school_id=school_id,
            user_id=user_id,
        )
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Student {user_id} not found.',
            )

        lesson_instance = LessonInstancesCRUD.get_current_lesson_instance_for_class(
            db=db,
            class_id=student.class_id,
            current_time=access_time,
        )

        if not lesson_instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Lesson instance for class {student.class_id} not found.',
            )

        return lesson_instance.room_id != room_id
