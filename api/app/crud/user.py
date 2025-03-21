from sqlalchemy.orm import Session
from app.models import User, School
from app.schemas.user import UserIn #, UserUpdate
from passlib.context import CryptContext
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UsersCRUD:
    @staticmethod
    def get_user(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_all_users(db: Session):
        return db.query(User).all()

    @staticmethod
    def create_user(db: Session, user: UserIn):
        existing_email_user = db.query(User).filter(User.email == user.email).first()
        existing_school = db.query(School).filter(School.id == user.school_id).first()

        if not existing_school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provided school does not exist"
            )

        if existing_email_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )
         
        hashed_password = pwd_context.hash(user.password)
        db_user = User(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=hashed_password,
            role=user.role,
            school_id=user.school_id
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    # @staticmethod
    # def update_user(db: Session, user_id: int, user_update: UserUpdate):
    #     db_user = db.query(User).filter(User.id == user_id).first()
    #     if not db_user:
    #         return None
    #     update_data = user_update.dict(exclude_unset=True)
    #     for key, value in update_data.items():
    #         setattr(db_user, key, value)
    #     db.commit()
    #     db.refresh(db_user)
    #     return db_user

    @staticmethod
    def delete_user(db: Session, user_id: int):
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User does not exist"
            )
        db.delete(db_user)
        db.commit()

    @staticmethod
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)
