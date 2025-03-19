from .student_factory import StudentFactory 
from .teacher_factory import TeacherFactory
from .admin_factory import AdminFactory
from .base_factory import UserFactory
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.school import SchoolsCRUD
from app.schemas.super_admin import SchoolOut

class UserFactoryProvider:
    def __init__(self, addition_code: int, school: SchoolOut, db: Session):
        self.addition_code = addition_code
        self.school = school 
 
    def get_factory(self) -> UserFactory: 
        role = self.determine_role(self.addition_code)
        factory = self.get_factory_by_role(role)
        return factory
    
    def determine_role(self, addition_code: str) -> str:
        if self.school.teacher_addition_code == addition_code:
            return "teacher"
        elif self.school.student_addition_code == addition_code:
            return "student"
        else:
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid addition code")
    
    def get_factory_by_role(self, role: str) -> UserFactory:
        if role =="teacher":
            return TeacherFactory()
        elif role == "student":
            return StudentFactory()
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported role")