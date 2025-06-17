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
            attendance_id: int,
            attendance_data: attendance.AttendanceIn,
            manual_adjustment: Optional[bool] = True
    ):
        AttendancesCRUD.check_if_conflict(
            db=db,
            attendance_data=attendance_data,
            id=attendance_id
        )
        attendance = db.query(Attendance).filter(
            Attendance.id == attendance_id,
        ).first()
        if not attendance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Attendance with id: {attendance_id} not found"
            )

        attendance.status = attendance_data.status
        attendance.manual_adjustment = manual_adjustment
        db.commit()
        db.refresh(attendance)
        return attendance
    @staticmethod
    def get_attendance_by_lesson_id(
            db: Session,
            lesson_id: int,
            access_time: datetime,
            student_id: int,
    ):
        attendance = db.query(Attendance).join(LessonInstance).filter(
            and_(
                LessonInstance.start_time <= access_time,
                LessonInstance.end_time >= access_time,
                Attendance.lesson_id == lesson_id,
                Attendance.student_id == student_id,
            )
        ).first()

        return attendance

    @staticmethod
    def get_status_base_on_access_time(
            minutes_late: int
    ):
        if minutes_late <= 7:
            return "present"
        elif minutes_late <= 18:
            return "late"
        else:
            return "absent"
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
    ) -> list[dict]:
        # CASE-y liczące poszczególne statusy
        present_case = case((Attendance.status == "present" or Attendance.status == "late", 1), else_=0)
        late_case = case((Attendance.status == "late", 1), else_=0)
        absent_case = case((Attendance.status == "absent", 1), else_=0)

        results = (
            db.query(
                LessonInstance.subject.label("subject"),
                func.count(Attendance.id).label("total"),
                func.sum(present_case).label("present_count"),
                func.sum(late_case).label("late_count"),
                func.sum(absent_case).label("absent_count"),
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
                "present_percent": round((int(r.total) - int(r.absent_count)) / r.total * 100, 2) if r.total else 0.0,
                "present_count": (int(r.total) - int(r.absent_count)),
                "late_count": int(r.late_count),
                "absent_count": int(r.absent_count),
                "total": int(r.total),
            }
            for r in results
        ]