from app.schemas import attendance, access_log
from app.models import Attendance, Student, LessonInstance, User, Room
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, case, func
from typing import Optional
from datetime import datetime, time, timedelta
from app.crud.lesson_instance import LessonInstancesCRUD
from app.crud.student import StudentCRUD

from app.models import AccessLog

from app.crud.teacher import TeachersCRUD



class AccessLogsCRUD:
    @staticmethod
    def create_access_log(
        db: Session,
        school_id: int,
        access_log_data: access_log.AccessLogIn
    ):
        existing_access_log = AccessLogsCRUD.check_if_unclosed_access_log_exists(
            db=db,
            room_id=access_log_data.room_id,
            user_id=access_log_data.user_id,
        )
        if existing_access_log:
            access_log_to_update = AccessLog(
                id=existing_access_log.id,
                user_id=existing_access_log.user_id,
                room_id=existing_access_log.room_id,
                access_start_time=existing_access_log.access_start_time,
                access_end_time=access_log_data.access_time,
                access_status=existing_access_log.access_status,
                reason=existing_access_log.reason,
                created_at=existing_access_log.created_at,
            )
            updated_access_log =  AccessLogsCRUD.update_access_log(
                db=db,
                access_log_id=existing_access_log.id,
                access_log_data=access_log_to_update
            )
            # websocket wysyłający do rasbperry pi request o otwarciu drzwi
            return updated_access_log
        else:
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
                # stworzyc funkcje która porówna LessonInstance.start_time i access_time i wstawi na tej bazie obecność / spóźnienie
                # websocket wysyłający do rasbperry pi request o otwarciu drzwi
            else:
                db_access_log = AccessLog(
                    user_id=access_log_data.user_id,
                    room_id=access_log_data.room_id,
                    access_start_time=access_log_data.access_time,
                    reason="Student currently do not have lesson in this room.",
                    access_status="denied"
                )
                # websocket wysyłający do nauczyciela powiadomienie o próbie wejścia do sali odrzuconej przez system
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
        existing_access_log = db.query(AccessLog).filter(
            and_(
                AccessLog.user_id == user_id,
                AccessLog.room_id == room_id,
                AccessLog.access_end_time.is_(None),
                AccessLog.access_status == "granted"
            )
        ).first()
        return existing_access_log

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

        lesson_instance = LessonInstancesCRUD.get_current_lesson_instance_for_class_or_teacher(
            db=db,
            class_id=student.class_id,
            current_time=access_time,
        )

        if not lesson_instance:
            return False

        return lesson_instance.room_id == room_id

    @staticmethod
    def get_all_denied_access_logs_for_lesson_instance(
            db: Session,
            school_id: int,
            user_id: int,
            current_time: datetime
    ):
        lesson_instance = AccessLogsCRUD.check_if_teacher_have_lesson_in_room(
            db=db,
            school_id=school_id,
            user_id=user_id,
            current_time=current_time,
        )
        if not lesson_instance:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f'Teacher {user_id} do not have lesson in this room.',
            )

        ten_minutes_ago = current_time - timedelta(minutes=10)

        denied_access_logs = db.query(AccessLog).filter(
            and_(
                AccessLog.room_id == lesson_instance.room_id,
                AccessLog.access_start_time >= ten_minutes_ago,
                AccessLog.access_start_time <= current_time,
                AccessLog.access_status == "denied"
            )
        ).all()

        return denied_access_logs

    @staticmethod
    def check_if_teacher_have_lesson_in_room(
        db: Session,
        school_id: int,
        user_id: int,
        current_time: datetime
    ):
        teacher = TeachersCRUD.get_teacher_by_user_id(
            db=db,
            school_id=school_id,
            user_id=user_id,
        )
        if not teacher:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Teacher {user_id} not found.',
            )

        lesson_instance = LessonInstancesCRUD.get_current_lesson_instance_for_class_or_teacher(
            db=db,
            current_time=current_time,
            teacher_id=teacher.id,
        )
        if not lesson_instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Lesson instance for teacher {teacher.id} not found.',
            )

        if lesson_instance.room_id == lesson_instance.room_id:
            return lesson_instance
        return None

    @staticmethod
    def approve_door_request(
            school_id: int,
            db: Session,
            approval_data: access_log.AccessLogApproval,
            access_log_id: int,
            user: User
    ):
        if approval_data.status not in ("granted", "denied"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Invalid approval status: {approval_data.status}',
            )

        ten_minutes_ago = approval_data.current_time - timedelta(minutes=10)
        access_log = db.query(AccessLog).filter(
            AccessLog.id == access_log_id,
        ).first()

        if not access_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Access log {access_log_id} not found. Or is outdated',
            )

        if not(access_log.access_start_time <= approval_data.current_time and access_log.access_start_time >= ten_minutes_ago):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Access log {access_log_id} is outdated',
            )
        if user.role == "teacher":
            teacher_have_lesson = AccessLogsCRUD.check_if_teacher_have_lesson_in_room(
                db=db,
                school_id=school_id,
                current_time=approval_data.current_time,
                user_id=approval_data.user_id,
            )
            if not teacher_have_lesson:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f'Teacher currently do not have lesson in this room.',
                )
        if access_log.access_status == "granted":
            return access_log

        access_log.access_status = approval_data.status
        db.commit()
        db.refresh(access_log)
        # jeżeli status jest granted to wyślij do aplikacji mobilnej websocketem informacje o potwierdzeniu door requestu
        # wyślij do raspberru pi że ma otworzyć drzwi
        return access_log

    @staticmethod
    def open_close_door(
            db: Session,
            access_log_data: access_log.AccessLogIn,
    ):
        existing_access_log = AccessLogsCRUD.check_if_unclosed_access_log_exists(
            db=db,
            room_id=access_log_data.room_id,
            user_id=access_log_data.user_id,
        )
        if existing_access_log:
            access_log_to_update = AccessLog(
                id=existing_access_log.id,
                user_id=existing_access_log.user_id,
                room_id=existing_access_log.room_id,
                access_start_time=existing_access_log.access_start_time,
                access_end_time=access_log_data.access_time,
                access_status=existing_access_log.access_status,
                reason=existing_access_log.reason,
                created_at=existing_access_log.created_at,
            )
            return AccessLogsCRUD.update_access_log(
                db=db,
                access_log_id=access_log_to_update.id,
                access_log_data=access_log_to_update,
            )
        else:
            new_access_log = AccessLog(
                user_id=access_log_data.user_id,
                room_id=access_log_data.room_id,
                access_start_time=access_log_data.access_time,
                access_status="granted",
                reason="Teacher and admin can access any room.", #  In the future teacher will have field containing rooms they can enter
            )
            db.add(new_access_log)
            db.commit()
            db.refresh(new_access_log)
            return new_access_log

    @staticmethod
    def get_all_access_logs(
            db: Session,
            school_id: int,
            room_id: Optional[str] = None,
            page: int = 1,
            limit: int = 15,
            start_date: Optional[datetime] = None,
            end_date: Optional[datetime] = None,
    ):
        base_query = db.query(AccessLog).join(Room).filter(Room.school_id == school_id)
        if room_id:
            base_query = base_query.filter(
                AccessLog.room_id == room_id
            )
        print(start_date)
        print(end_date)
        if start_date and end_date:
            base_query = base_query.filter(
                and_(
                    AccessLog.access_start_time >= start_date,
                    AccessLog.access_start_time <= end_date
                )
            )

        access_logs = base_query.offset((page - 1) * limit).limit(limit).all()

        has_next = base_query.offset(page * limit).limit(1).all()
        has_next_page = len(has_next) > 0

        total_count = base_query.count()

        return {
            "has_next_page": has_next_page,
            "total_count": total_count,
            "access_logs": access_logs,
        }