from fastapi import APIRouter, HTTPException, status, Depends, Response
from app.schemas.super_admin import CreateSchoolData, SchoolOut
from app.config import settings
from sqlalchemy.orm import Session
from app.crud.factories.admin_factory import AdminFactory
from app.crud.school import SchoolsCRUD
from app.database import get_db 
from app.schemas.user import UserOut, UserIn
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

@router.post("/schools/{admin_code}", response_model=SchoolOut)
def create_school_and_school_admin(admin_code: str, school_and_admin: CreateSchoolData, db: Session = Depends(get_db)):
    check_if_super_admin(admin_code)

    created_school = SchoolsCRUD.create_school(
            db=db,
            school=school_and_admin.school,
        )
    print("w route")
    print(created_school)
    admin_data = {
        **school_and_admin.admin.dict(),
        "school_id": created_school.id,
    }

    user_in = UserIn(**admin_data)
    admin_factory = AdminFactory()
    created_admin = admin_factory.create_user(
        db=db,
        user_data=user_in
        )
    

    return created_school

@router.delete("/{admin_code}/schools/{school_id}")
def delete_school_and_admin(admin_code: str, school_id: int, db: Session = Depends(get_db)):
    check_if_super_admin(admin_code)
    school = SchoolsCRUD.get_school_by_id(db=db, school_id=school_id)

    admin = AdminsCRUD.get_admin_by_school_id(db=db,school_id=school.id)
    AdminsCRUD.delete_admin(db=db, admin_id=admin.id)
    school = SchoolsCRUD.delete_school(db=db, school_id=school_id)

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{admin_code}/schools")
def get_all_schools(admin_code: str, db: Session = Depends(get_db)):
    check_if_super_admin(admin_code)

    schools = SchoolsCRUD.get_all_schools(db=db)
    return schools