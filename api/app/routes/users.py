from fastapi import APIRouter, Depends 
from sqlalchemy.orm import Session 
from app.schemas.user import UserIn, UserOut 
from app.crud.factories.user_factory_provider import UserFactoryProvider
from app.database import get_db 

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserOut)
def create_user(user_data: UserIn, db: Session = Depends(get_db)):
    factory = UserFactoryProvider.get_factory(user_data.role)
    user = factory.create_user(db, user_data)
    return user