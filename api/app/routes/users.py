from fastapi import APIRouter, Depends 
from sqlalchemy.orm import Session 
from app.schemas.user import UserIn, UserOut, UserInRequest
from app.crud.factories.user_factory_provider import UserFactoryProvider
from app.database import get_db 
from app.crud.school import SchoolsCRUD
from app.crud.user import UsersCRUD
from app.oauth2 import get_current_user
from app.models import User


router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserOut)
def create_user(user_data: UserInRequest, db: Session = Depends(get_db)):
    print(user_data.addition_code)
    school = SchoolsCRUD.get_school_by_addition_code(db, user_data.addition_code)

    userFactoryProvider = UserFactoryProvider(
        addition_code=user_data.addition_code,
        school=school,
        db=db
    )
    factory = userFactoryProvider.get_factory()
    user = factory.create_user(db, UserIn(
        school_id=school.id,
        **user_data.dict()
    ))
    return user

@router.get("/", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    return current_user