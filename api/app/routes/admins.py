from fastapi import APIRouter, Depends
from app.database import get_db
from ..crud.admin import AdminsCRUD
from typing import List
from ..schemas import admin
from sqlalchemy.orm import Session 
router = APIRouter(
    prefix="/admins",
    tags=["admins"],
)
@router.get("/", response_model=List[admin.AdminOut])
def get_students(db: Session = Depends(get_db)):    

    return AdminsCRUD.get_all_users(db)