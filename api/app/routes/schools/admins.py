from fastapi import APIRouter, Depends
from app.database import get_db
from ...crud.admin import AdminsCRUD
from typing import List
from ...schemas import admin
from sqlalchemy.orm import Session 
from app.role_checker import admin_only
from ...oauth2 import school_checker
from ...models import User

router = APIRouter(
    prefix="/admins",
    tags=["admins"],
)
@router.get("/", response_model=List[admin.AdminOut], dependencies=[Depends(admin_only)])
def get_students(school_id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):    

    return AdminsCRUD.get_all_users(db, school_id)

@router.get("/admin", response_model=admin.AdminOut, dependencies=[Depends(admin_only)])
def get_admin(school_id: int, db: Session = Depends(get_db), school_checker: User = Depends(school_checker)):
    return AdminsCRUD.get_admin_by_school_id(
        db=db,
        school_id=school_id
    )