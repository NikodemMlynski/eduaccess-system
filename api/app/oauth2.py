from datetime import datetime, timedelta 
from typing import Optional 

from jose import JWTError, jwt 
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer 
from sqlalchemy.orm import Session 

from app.schemas.auth import TokenData 
from app.models import User 
from app.database import get_db 
from app.config import settings

from app.crud.student import StudentCRUD

from app.crud.lesson_instance import LessonInstancesCRUD
from app.crud.teacher import TeachersCRUD

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token data")
        
        return TokenData(user_id=user_id, role=role)
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    token_data = decode_access_token(token)
    user = db.query(User).filter(User.id == token_data.user_id).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def school_checker( school_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.school_id != school_id:
            raise HTTPException(status_code=403, detail="You are not permitted to access data for a different school")

def protect(user_id: int, permitted_roles: [str], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not(current_user.id == user_id or current_user.role in permitted_roles):
        raise HTTPException(status_code=403, detail="You are not permitted to access fate for another user")

def class_protect(class_id: int, permitted_roles: [str], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if (current_user.role in permitted_roles):
        return
    print(current_user.__dict__)
    student = StudentCRUD.get_student_by_user_id(db=db, user_id=current_user.id, school_id=current_user.school_id)
    if (not student or student.class_id != class_id):
        raise HTTPException(status_code=403, detail="You are not permitted to access data for a different class")

def attendances_protect(lesson_instance_id: int, permitted_roles: [str], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if (current_user.role in permitted_roles):
        return
    if (current_user.role == "student"):
        raise HTTPException(status_code=403, detail="You are not permitted to managa attendances as a student")
    lesson_instance = LessonInstancesCRUD.get_lesson_instance_by_id(db=db, lesson_id=lesson_instance_id)
    teacher = TeachersCRUD.get_teacher_by_user_id(db=db, user_id=current_user.id, school_id=current_user.school_id)

    if (not teacher or teacher.id != lesson_instance.teacher_id):
        raise HTTPException(status_code=403, detail="You are not permitted to manage attendances for lesson that you are not teaching")