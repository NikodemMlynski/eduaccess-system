from fastapi import APIRouter, HTTPException, status, Depends, Response
from app.schemas.super_admin import CreateSchoolData
from app.config import settings
from sqlalchemy.orm import Session
from app.crud.factories.admin_factory import AdminFactory
from app.crud.school import SchoolsCRUD
from app.database import get_db 
from app.schemas.user import UserOut
from app.models import School, Administrator
from app.crud.admin import AdminsCRUD


router = APIRouter(
    prefix="/super_admin",
)
def check_if_super_admin(admin_code: str):
    super_admin_code = settings.super_admin_code
    if admin_code != super_admin_code:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid super admin code."
        )

@router.post("/schools/{admin_code}")
def create_school_and_school_admin(admin_code: str, school_and_admin: CreateSchoolData, db: Session = Depends(get_db)):
    check_if_super_admin(admin_code)

    admin_factory = AdminFactory()
    created_admin = admin_factory.create_user(
        db=db,
        user_data=school_and_admin.admin)
    print(created_admin)
    created_school = SchoolsCRUD.create_school(
        db=db,
        school=school_and_admin.school,
        admin_id=created_admin.id
    )

    return {
        "school": created_school
    }

@router.delete("/{admin_code}/schools/{school_id}")
def delete_school_and_admin(admin_code: str, school_id: int, db: Session = Depends(get_db)):
    check_if_super_admin(admin_code)
    
    admin_id = SchoolsCRUD.delete_school(db=db, school_id=school_id)
    print(admin_id)

    AdminsCRUD.delete_admin(db=db, admin_id=admin_id)
    

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{admin_code}/schools")
def get_all_schools(admin_code: str, db: Session = Depends(get_db)):
    check_if_super_admin(admin_code)

    schools = SchoolsCRUD.get_all_schools(db=db)
    return schools