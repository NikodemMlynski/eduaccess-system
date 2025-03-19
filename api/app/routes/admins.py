from fastapi import APIRouter, Depends
from app.database import get_db
from ..crud.admin import AdminsCRUD
from typing import List
from ..schemas import admin
from sqlalchemy.orm import Session 
from app.role_checker import RoleChecker

router = APIRouter(
    prefix="/admins",
    tags=["admins"],
)
@router.get("/", response_model=List[admin.AdminOut])
def get_students(db: Session = Depends(get_db)):    

    return AdminsCRUD.get_all_users(db)

@router.get("/{id}", response_model=admin.AdminOut)
def get_admin(id: int, db: Session = Depends(get_db)):
    return AdminsCRUD.get_admin(
        db=db,
        admin_id=id
    )