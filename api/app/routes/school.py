from fastapi import APIRouter 
from .schools import students
from .schools import admins
from .schools import teachers

router = APIRouter(prefix="/school/{school_id}", tags=["School"])

router.include_router(students.router)
router.include_router(admins.router)
router.include_router(teachers.router)

