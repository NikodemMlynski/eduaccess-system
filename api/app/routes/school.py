from fastapi import APIRouter

from .schools import attendances
from .schools import students
from .schools import admins
from .schools import teachers
from .schools import class_
from .schools import rooms
from .schools import lesson_templates
from .schools import lesson_instances
from ..crud.school import SchoolsCRUD
from ..schemas.super_admin import SchoolOut
from ..role_checker import admin_only
from fastapi import Depends
from app.database import get_db
from app.models import User
from sqlalchemy.orm import Session
from ..oauth2 import school_checker, get_current_user

router = APIRouter(prefix="/school/{school_id}", tags=["School"])

router.include_router(students.router)
router.include_router(admins.router)
router.include_router(teachers.router)
router.include_router(class_.router)
router.include_router(rooms.router)
router.include_router(lesson_templates.router)
router.include_router(lesson_instances.router)
router.include_router(attendances.router)

@router.get("/", response_model=SchoolOut)
def get_school(
    school_id: int,
    db: Session = Depends(get_db),
    school_checker: User = Depends(school_checker),
):
    return SchoolsCRUD.get_school_by_id(db=db, school_id=school_id)


