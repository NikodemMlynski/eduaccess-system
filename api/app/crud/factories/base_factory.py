from abc import ABC, abstractmethod 
from sqlalchemy.orm import Session 
from app.schemas.user import UserIn 
from app.models import User 

class UserFactory(ABC):
    @abstractmethod 
    def create_user(self, db: Session, user_data: UserIn) -> User:
        pass