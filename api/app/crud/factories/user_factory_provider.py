from .student_factory import StudentFactory 
from .teacher_factory import TeacherFactory
from .admin_factory import AdminFactory
from .base_factory import UserFactory

class UserFactoryProvider:
    factories = {
        "student": StudentFactory(),
        "teacher": TeacherFactory(),
        "admin": AdminFactory(),
    }

    @staticmethod 
    def get_factory(role: str) -> UserFactory: 
        factory = UserFactoryProvider.factories.get(role)
        if not factory:
            raise ValueError(f"Unknown role {role}")
        return factory