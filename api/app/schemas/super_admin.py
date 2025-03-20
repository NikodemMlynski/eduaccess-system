from pydantic import BaseModel
from .user import UserIn

class SuperAdminCode(BaseModel):
    code: str

class SchoolIn(BaseModel):
    name: str
    address: str
    
class AdminUserIn(BaseModel):
    first_name: str
    last_name: str 
    email: str 
    role: str 
    password: str 

class CreateSchoolData(BaseModel):
    school: SchoolIn
    admin: AdminUserIn



class SchoolOut(BaseModel):
    id: int 
    name: str 
    address: str
    student_addition_code: str 
    teacher_addition_code: str