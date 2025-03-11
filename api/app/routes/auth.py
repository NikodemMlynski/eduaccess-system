# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from passlib.context import CryptContext
# from app.database import get_db
# from app import models
# from app.schemas import auth_schema
# from app.oauth2 import create_access_token
# from app.utils import verify_password, hash_password

# router = APIRouter(
#     prefix="/auth",
#     tags=["Authentication"]
# )

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# @router.post("/admin/signup", status_code=status.HTTP_201_CREATED)
# def create_admin(admin_data: auth_schema.AdminSignup, db: Session = Depends(get_db)):
#     existing_admin = db.query(models.Administrators).filter(models.Administrators.username == admin_data.username).first()
#     if existing_admin:
#         raise HTTPException(status_code=400, detail="Administrator already exists")

#     hashed_password = hash_password(admin_data.password)
#     new_admin = models.Administrators(
#         username=admin_data.username,
#         password=hashed_password
#     )

#     db.add(new_admin)
#     db.commit()
#     db.refresh(new_admin)

#     return {"message": "Administrator created successfully"}

# @router.post("/admin/signin", response_model=auth_schema.Token)
# def login_admin(login_data: auth_schema.Login, db: Session = Depends(get_db)):
#     admin = db.query(models.Administrators).filter(models.Administrators.username == login_data.username).first()
    
#     if not admin or not verify_password(login_data.password, admin.password):
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     access_token = create_access_token(data={"user_id": admin.id, "is_admin": True})

#     return {"access_token": access_token, "token_type": "bearer"}

# @router.post("/user/signup", status_code=status.HTTP_201_CREATED)
# def create_user(user_data: auth_schema.UserSignup, db: Session = Depends(get_db)):
#     existing_user = db.query(models.Users).filter(models.Users.email == user_data.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="User already exists")

#     hashed_password = hash_password(user_data.password)
#     new_user = models.Users(
#         first_name=user_data.first_name,
#         last_name=user_data.last_name,
#         email=user_data.email,
#         password=hashed_password
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return {"message": "User created successfully"}

# @router.post("/user/signin", response_model=auth_schema.Token)
# def login_user(login_data: auth_schema.Login, db: Session = Depends(get_db)):
#     user = db.query(models.Users).filter(models.Users.email == login_data.username).first()

#     if not user or not verify_password(login_data.password, user.password):
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     access_token = create_access_token(data={"user_id": user.id, "is_admin": False})

#     return {"access_token": access_token, "token_type": "bearer"}
