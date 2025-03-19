from pydantic import BaseModel
from .user import UserIn

class SuperAdminCode(BaseModel):
    code: str

class SchoolIn(BaseModel):
    name: str
    address: str

class CreateSchoolData(BaseModel):
    school: SchoolIn
    admin: UserIn

class SchoolOut(BaseModel):
    id: str 
    name: str 
    admin_id: int 
    student_addition_code: str 
    teacher_addition_code: str