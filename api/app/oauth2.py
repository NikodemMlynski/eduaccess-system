from jose import JWTError, jwt 
from datetime import datetime, timedelta
from fastapi import Depends, status, HTTPException 
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session 

from app.schemas import auth_schema 
from app import models
from app.database import get_db
from app.config import settings 

# OAuth2 dla FastAPI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Konfiguracja JWT
ALGORITHM = settings.algorithm 
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
SECRET_KEY = settings.secret_key

def create_access_token(data: dict):
    """Tworzenie tokenu JWT z danymi użytkownika."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode_jwt

def verify_access_token(token: str, credentials_exception):
    """Weryfikacja tokenu i zwracanie danych użytkownika."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        is_admin: bool = payload.get("is_admin", False)  # True jeśli admin, False jeśli user

        if user_id is None:
            raise credentials_exception
        
        return auth_schema.TokenData(id=user_id, is_admin=is_admin)

    except JWTError:
        raise credentials_exception

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Pobranie aktualnie zalogowanego użytkownika lub administratora."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = verify_access_token(token, credentials_exception)

    if token_data.is_admin:
        user = db.query(models.Administrator).filter(models.Administrator.id == token_data.id).first()
    else:
        user = db.query(models.Users).filter(models.Users.id == token_data.id).first()

    if user is None:
        raise credentials_exception
    
    return user

def get_current_admin(current_user: models.Administrator = Depends(get_current_user)):
    """Sprawdzenie, czy użytkownik jest administratorem (musi być w tabeli Administrators)."""
    if not isinstance(current_user, models.Administrator):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource"
        )
    return current_user
