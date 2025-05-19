from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, SmallInteger, LargeBinary
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func


# ENUMS
role_enum = Enum("admin", "teacher", "student", name="role_enum")
status_enum = Enum("present", "absent", "late", name="status_enum")
access_status_enum = Enum("granted", "denied", name="access_status_enum")


# SCHOOL

class School(Base):
    __tablename__ = "school"
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    teacher_addition_code = Column(String, nullable=False)
    student_addition_code = Column(String, nullable=False)
    
    # Relationships
    classes = relationship("Class", back_populates="school")
    rooms = relationship("Room", back_populates="school")
    students = relationship("Student", back_populates="school")
    users = relationship("User", back_populates="school")


# USERS

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(role_enum, nullable=False)
    password = Column(String, nullable=False)
    face_encoding = Column(LargeBinary, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=True)
    
    # Relationships
    school = relationship("School", back_populates="users")


# ADMINISTRATORS

class Administrator(Base):
    __tablename__ = "administrators"
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    user = relationship("User", lazy="joined")


# STUDENTS

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=True)
    
    user = relationship("User", lazy="joined")
    class_ = relationship("Class")
    school = relationship("School", back_populates="students")


# TEACHERS

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    user = relationship("User", lazy="joined")


# CLASSES

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, nullable=False)
    class_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=True)
    
    school = relationship("School", back_populates="classes")


# ROOMS

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, nullable=False)
    room_name = Column(String, nullable=False)
    capacity = Column(SmallInteger, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    school_id = Column(Integer, ForeignKey("school.id"), nullable=True)
    
    school = relationship("School", back_populates="rooms")


# SCHEDULE

class LessonTemplate(Base):
    __tablename__ = "lesson_templates"
    id = Column(Integer, primary_key=True, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    subject = Column(String, nullable=False)
    weekday = Column(Integer, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    class_ = relationship("Class")
    room = relationship("Room")
    teacher = relationship("Teacher")

class LessonInstance(Base):
    __tablename__ = "lesson_instances"
    id = Column(Integer, primary_key=True, nullable=False)
    template_id = Column(Integer, ForeignKey("lesson_templates.id", ondelete="SET NULL"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    subject = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    template = relationship("LessonTemplate")
    class_ = relationship("Class")
    room = relationship("Room")
    teacher = relationship("Teacher")


# ATTENDANCES

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lesson_instances.id"), nullable=False)
    status = Column(status_enum, nullable=False)
    manual_adjustment = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    student = relationship("Student")
    lesson = relationship("LessonInstance")


# ACCESS LOGS

class AccessLog(Base):
    __tablename__ = "access_logs"
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    access_start_time = Column(DateTime, nullable=False)
    access_end_time = Column(DateTime, nullable=True)
    access_status = Column(access_status_enum, nullable=False)
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    user = relationship("User")
    room = relationship("Room")
