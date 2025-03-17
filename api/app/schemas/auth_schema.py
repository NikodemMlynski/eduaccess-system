from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """Schema zwracany po zalogowaniu (token JWT)"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Dane zawarte w tokenie JWT"""
    id: str  # ID użytkownika (może być adminem lub userem)
    is_admin: bool  # Czy użytkownik jest adminem?

class Login(BaseModel):
    """Schema do logowania użytkownika"""
    username: str
    password: str

class AdminSignup(BaseModel):
    username: str
    password: str

class UserSignup(BaseModel):
    username: str
    password: str