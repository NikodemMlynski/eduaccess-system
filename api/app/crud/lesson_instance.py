from app.schemas import lesson_instance
from app.models import LessonInstance
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional
from datetime import datetime, timedelta

class LessonInstancesCRUD:
    @staticmethod
    def check_if_collisions(
            db: Session,
            lesson_instance_data: lesson_instance.LessonInstanceIn,
            id: int = None,
    ):
        lesson_duration = lesson_instance_data.end_time - lesson_instance_data.start_time
        if timedelta(minutes=45) != lesson_duration:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lesson duration must be 45 minutes"
            )
        lesson_instance = db.query(LessonInstance).filter(
            or_(
                and_( # room is occupied
                    LessonInstance.room_id == lesson_instance_data.room_id,
                    LessonInstance.start_time == lesson_instance_data.start_time,
                    LessonInstance.end_time == lesson_instance_data.end_time,
                    LessonInstance.id != id if id else True,
                ),
                and_( # class is busy
                    LessonInstance.class_id == lesson_instance_data.class_id,
                    LessonInstance.start_time == lesson_instance_data.start_time,
                    LessonInstance.end_time == lesson_instance_data.end_time,
                    LessonInstance.id != id if id else True,
                ),
                and_( # teacher is busy
                    LessonInstance.teacher_id == lesson_instance_data.teacher_id,
                    LessonInstance.start_time == lesson_instance_data.start_time,
                    LessonInstance.end_time == lesson_instance_data.end_time,
                    LessonInstance.id != id if id else True,
                )
            )
        ).first()

        if lesson_instance:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Class: {lesson_instance.class_.class_name} have {lesson_instance.subject} at {lesson_instance.start_time}-{lesson_instance.end_time} with {lesson_instance.teacher.user.first_name} {lesson_instance.teacher.user.last_name} on {lesson_instance.room.room_name}"
            )
    @staticmethod
    def create_lesson_instance(
            db: Session,
            lesson_instance_data: lesson_instance.LessonInstanceIn
    ):
        LessonInstancesCRUD.check_if_collisions(
            db=db,
            lesson_instance_data=lesson_instance_data
        )
        db_lesson_instance = LessonInstance(
            template_id=lesson_instance_data.template_id,
            class_id=lesson_instance_data.class_id,
            room_id=lesson_instance_data.room_id,
            teacher_id=lesson_instance_data.teacher_id,
            subject=lesson_instance_data.subject,
            start_time=lesson_instance_data.start_time,
            end_time=lesson_instance_data.end_time
        )
        db.add(db_lesson_instance)
        db.commit()
        db.refresh(db_lesson_instance)
        return db_lesson_instance

    @staticmethod
    def get_all_lesson_instances_for_class(
            db: Session,
            class_id: int,
            date: datetime
    ):
        lesson_instances = db.query(LessonInstance).filter(
            and_(
                LessonInstance.class_id == class_id,
                LessonInstance.start_time >= date,
                LessonInstance.end_time <= date + timedelta(days=1)
            )
        ).all()
        return lesson_instances

    @staticmethod
    def get_all_lesson_instances_for_teacher(
            db: Session,
            teacher_id: int,
            date: datetime
    ):
        lesson_instances = db.query(LessonInstance).filter(
            and_(
                LessonInstance.teacher_id == teacher_id,
                LessonInstance.start_time >= date,
                LessonInstance.end_time <= date + timedelta(days=1)
            )
        ).all()
        return lesson_instances

    @staticmethod
    def get_all_lesson_instances_for_room(
            db: Session,
            room_id: int,
            date: datetime
    ):
        lesson_instances = db.query(LessonInstance).filter(
            and_(
                LessonInstance.room_id == room_id,
                LessonInstance.start_time >= date,
                LessonInstance.end_time <= date + timedelta(days=1)
            )
        ).all()
        return lesson_instances

    @staticmethod
    def delete_lesson_instance(
            db: Session,
            id: int
    ):
        lesson_instance = db.query(LessonInstance).filter(
            LessonInstance.id == id
        ).first()

        if not lesson_instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson instance not found"
            )
        db.delete(lesson_instance)
        db.commit()
        return {"detail": "Lesson instance deleted successfully"}

    @staticmethod
    def update_lesson_instance(
            db: Session,
            id: int,
            lesson_instance_update_data: lesson_instance.LessonInstanceIn
    ):
        lesson_instance_to_update = db.query(LessonInstance).filter(
            LessonInstance.id == id
        ).first()

        if not lesson_instance_to_update:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson instance not found"
            )

        LessonInstancesCRUD.check_if_collisions(
            db=db,
            lesson_instance_data=lesson_instance_update_data,
            id=id
        )

        lesson_instance_to_update.template_id = lesson_instance_update_data.template_id
        lesson_instance_to_update.class_id = lesson_instance_update_data.class_id
        lesson_instance_to_update.room_id = lesson_instance_update_data.room_id
        lesson_instance_to_update.teacher_id = lesson_instance_update_data.teacher_id
        lesson_instance_to_update.subject = lesson_instance_update_data.subject
        lesson_instance_to_update.start_time = lesson_instance_update_data.start_time
        lesson_instance_to_update.end_time = lesson_instance_update_data.end_time
        db.commit()
        db.refresh(lesson_instance_to_update)
        return lesson_instance_to_update
