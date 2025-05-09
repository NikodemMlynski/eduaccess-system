from fastapi import APIRouter 
from .schools import students
from .schools import admins
from .schools import teachers
from .schools import class_
from .schools import rooms
from .schools import lesson_templates
from .schools import lesson_instances

router = APIRouter(prefix="/school/{school_id}", tags=["School"])

router.include_router(students.router)
router.include_router(admins.router)
router.include_router(teachers.router)
router.include_router(class_.router)
router.include_router(rooms.router)
router.include_router(lesson_templates.router)
router.include_router(lesson_instances.router)

