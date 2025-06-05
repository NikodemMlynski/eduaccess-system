from app.schemas import attendance
from app.models import Attendance, Student, LessonInstance
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, case, func
from typing import Optional
from datetime import datetime, time
class AttendancesCRUD:

    @staticmethod
    def check_if_conflict(
            db: Session,
            attendance_data: attendance.AttendanceIn,
            id: int = None
    ):
        if attendance_data.status not in ("present", "absent", "late"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attendance status must be present or absent or late",
            )
        if not id:
            existing = db.query(Attendance).filter(
                and_(
                    Attendance.student_id == attendance_data.student_id,
                    Attendance.lesson_id == attendance_data.lesson_id
                )
            ).first()

            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Attendance {existing.lesson.subject} for student {existing.student.user.first_name} already exists"
                )

        student = db.query(Student).filter(Student.id == attendance_data.student_id).first()

        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student {student.user.first_name} not found"
            )

        lesson_instance = db.query(LessonInstance).filter(
            LessonInstance.id == attendance_data.lesson_id
        ).first()

        if not lesson_instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lesson instance you're trying to assign attendance not found"
            )

        if student.class_id != lesson_instance.class_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Student is not assigned to the class that you're trying to assign attendance for"
            )
    @staticmethod
    def create_attendance(
            db: Session,
            attendance_data: attendance.AttendanceIn,
    ):
        AttendancesCRUD.check_if_conflict(
            db=db,
            attendance_data=attendance_data,
        )

        db_attendance = Attendance(
            lesson_id=attendance_data.lesson_id,
            student_id=attendance_data.student_id,
            status=attendance_data.status,
            manual_adjustment=attendance_data.manual_adjustment,
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance

    @staticmethod
    def delete_attendance(
        db: Session,
        id: int
    ):
        attendance = db.query(Attendance).filter(
            Attendance.id == id,
        ).first()

        if not attendance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Attendance with id: {id} not found"
            )

        db.delete(attendance)
        db.commit()
        return {"datail": "Attendance deleted successfully"}

    @staticmethod
    def update_attendance(
            db: Session,
            id: int,
            attendance_data: attendance.AttendanceIn,
    ):
        AttendancesCRUD.check_if_conflict(
            db=db,
            attendance_data=attendance_data,
            id=id
        )
        attendance = db.query(Attendance).filter(
            Attendance.lesson_id == attendance_data.lesson_id,
        ).first()
        if not attendance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Attendance with id: {id} not found"
            )

        attendance.status = attendance_data.status
        attendance.manual_adjustment = True
        db.commit()
        db.refresh(attendance)
        return attendance

    @staticmethod
    def get_class_attendance_by_day(
        db: Session,
        class_id: int,
        day: datetime.date,
    ) -> list:
        start = datetime.combine(day, time.min)
        end = datetime.combine(day, time.max)
        attendances = (
            db.query(Attendance)
            .join(Student, Attendance.student_id == Student.id)
            .join(LessonInstance, Attendance.lesson_id == LessonInstance.id)
            .filter(
                and_(
                    LessonInstance.class_id == class_id,
                    LessonInstance.start_time >= start,
                    LessonInstance.start_time <= end
                )
            )
            .all()
        )
        return attendances

    @staticmethod
    def get_student_attendance_by_day(
        db: Session,
        student_id: int,
        day: datetime.date
    ) -> list:
        start = datetime.combine(day, time.min)
        end = datetime.combine(day, time.max)
        print(start)
        print(end)
        print(student_id)
        attendances = (
            db.query(Attendance)
            .join(LessonInstance, Attendance.lesson_id == LessonInstance.id)
            .filter(
                and_(
                Attendance.student_id == student_id,
                    LessonInstance.start_time >= start,
                    LessonInstance.start_time <= end
                )
            )
            .all()
        )
        return attendances

    @staticmethod
    def get_student_attendance_stats_by_subject(
        db: Session,
        student_id: int,
        date_from: datetime.date,
        date_to: datetime.date
    ) -> list:
        present_case = case(
            (Attendance.status == "present", 1),  # WHEN
            else_=0  # ELSE
        )

        results = (
            db.query(
                LessonInstance.subject.label("subject"),
                func.count(Attendance.id).label("total"),
                func.sum(present_case).label("present_count"),
            )
            .join(LessonInstance, Attendance.lesson_id == LessonInstance.id)
            .filter(
                Attendance.student_id == student_id,
                LessonInstance.start_time >= date_from,
                LessonInstance.start_time <= date_to,
            )
            .group_by(LessonInstance.subject)
            .all()
        )

        return [
            {
                "subject": r.subject,
                "present_percent": round(r.present_count / r.total * 100, 2) if r.total else 0.0,
                "present_count": r.present_count,
                "total": r.total,
            }
            for r in results
        ]