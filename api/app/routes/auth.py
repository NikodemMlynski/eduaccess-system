from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session 
from datetime import timedelta 
from app.models import User 
from app.schemas.auth import Token, LoginIn
from app.crud.user import UsersCRUD
from app.oauth2 import create_access_token, verify_password
from app.database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=Token)
def login(login_data: LoginIn, db: Session = Depends(get_db)):
    user = UsersCRUD.get_user_by_email(db, login_data.email)
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(
        data={"user_id": user.id, "role": user.role}
    )

    return {"access_token": token, "token_type": "bearer"}
