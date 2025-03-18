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