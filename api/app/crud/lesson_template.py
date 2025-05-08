from app.schemas import lesson_template
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy import and_, or_
from typing import Optional
from app.models import LessonTemplate

from app.utils import get_weekday


# TEACHERS: 1 (Geleta), 4:(Sikor), 7: (Majkowska), 8: (Gostamska)
# CLASSES: 9: 4A, 10: 3F, 11: 5B, 12: 3D, 13: 4D
# ROOMS: 9: 115B, 11: 150B, 12: 18A, 13: 212A, 16: 115A

class LessonTemplatesCRUD:
    @staticmethod
    def check_if_collisions(
            db: Session,
            lesson_template_data: lesson_template.LessonTemplateIn,
            id: int = None,
    ):
        start_time_hours = int(lesson_template_data.start_time.split(":")[0])
        start_time_minutes = int(lesson_template_data.start_time.split(":")[1])
        end_time_hours = int(lesson_template_data.end_time.split(":")[0])
        end_time_minutes = int(lesson_template_data.end_time.split(":")[1])

        start_time = start_time_hours * 60 + start_time_minutes
        end_time = end_time_hours * 60 + end_time_minutes
        if end_time - start_time != 45:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lesson duration must be 45 minutes"
            )
        lesson_template = db.query(LessonTemplate).filter(
            or_(
                and_(  # room is occupied
                    LessonTemplate.room_id == lesson_template_data.room_id,
                    LessonTemplate.start_time == lesson_template_data.start_time,
                    LessonTemplate.end_time == lesson_template_data.end_time,
                    LessonTemplate.weekday == lesson_template_data.weekday,
                    LessonTemplate.id != id if id else True,
                ),
                and_(  # class is busy
                    LessonTemplate.class_id == lesson_template_data.class_id,
                    LessonTemplate.start_time == lesson_template_data.start_time,
                    LessonTemplate.end_time == lesson_template_data.end_time,
                    LessonTemplate.weekday == lesson_template_data.weekday,
                    LessonTemplate.id != id if id else True,
                ),
                and_(  # teacher is busy
                    LessonTemplate.teacher_id == lesson_template_data.teacher_id,
                    LessonTemplate.start_time == lesson_template_data.start_time,
                    LessonTemplate.end_time == lesson_template_data.end_time,
                    LessonTemplate.weekday == lesson_template_data.weekday,
                    LessonTemplate.id != id if id else True,
                )
            )
        ).first()
        weekday = get_weekday(lesson_template_data.weekday)

        if lesson_template:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Class: {lesson_template.class_.class_name} have {lesson_template.subject} at {lesson_template.start_time}-{lesson_template.end_time} with {lesson_template.teacher.user.first_name} {lesson_template.teacher.user.last_name} on {weekday} {lesson_template.room.room_name}"
            )

    @staticmethod
    def create_lesson_template(
        db: Session,
        lesson_template_data: lesson_template.LessonTemplateIn
    ):
       LessonTemplatesCRUD.check_if_collisions(
           db=db,
            lesson_template_data=lesson_template_data
       )

       db_lesson_template = LessonTemplate(
            class_id=lesson_template_data.class_id,
            room_id=lesson_template_data.room_id,
            teacher_id=lesson_template_data.teacher_id,
            subject=lesson_template_data.subject,
            weekday=lesson_template_data.weekday,
            start_time=lesson_template_data.start_time,
            end_time=lesson_template_data.end_time,
        )

       db.add(db_lesson_template)
       db.commit()
       db.refresh(db_lesson_template)
       return db_lesson_template

    @staticmethod
    def get_all_lesson_templates_for_class(
        db: Session,
        class_id: int,
    ):
        lesson_templates = db.query(LessonTemplate).filter(
            LessonTemplate.class_id == class_id
        ).all()
        return lesson_templates

    @staticmethod
    def get_all_lesson_templates_for_teacher(
        db: Session,
        teacher_id: int,
    ):
        lesson_templates = db.query(LessonTemplate).filter(
            LessonTemplate.teacher_id == teacher_id
        )
        return lesson_templates

    @staticmethod
    def get_all_lesson_templates_for_room(
        db: Session,
        room_id: int,
    ):
        lesson_templates = db.query(LessonTemplate).filter(
            LessonTemplate.room_id == room_id
        )
        return lesson_templates

    @staticmethod
    def update_lesson_template(
        db: Session,
        id: int,
        lesson_template_update_data: lesson_template.LessonTemplateIn
    ):
        lesson_template_to_update = db.query(LessonTemplate).filter(
            LessonTemplate.id == id
        ).first()

        if not lesson_template_to_update:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson template not found"
            )

        LessonTemplatesCRUD.check_if_collisions(
            db=db,
            lesson_template_data=lesson_template_update_data,
            id=id
        )

        lesson_template_to_update.class_id = lesson_template_update_data.class_id
        lesson_template_to_update.room_id = lesson_template_update_data.room_id
        lesson_template_to_update.teacher_id = lesson_template_update_data.teacher_id
        lesson_template_to_update.subject = lesson_template_update_data.subject
        lesson_template_to_update.weekday = lesson_template_update_data.weekday
        lesson_template_to_update.start_time = lesson_template_update_data.start_time
        lesson_template_to_update.end_time = lesson_template_update_data.end_time

        db.commit()
        db.refresh(lesson_template_to_update)
        return lesson_template_to_update

    @staticmethod
    def delete_lesson_template(
        db: Session,
        id: int
    ):
        lesson_template = db.query(LessonTemplate).filter(
            LessonTemplate.id == id
        ).first()

        if not lesson_template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson template not found"
            )

        db.delete(lesson_template)
        db.commit()
        return {"detail": "Lesson template deleted successfully"}