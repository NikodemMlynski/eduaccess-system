from pydantic import BaseModel, EmailStr 

class LoginIn(BaseModel):
    email: EmailStr
    password: str 

class Token(BaseModel):
    access_token: str 
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: int 
    role: str 