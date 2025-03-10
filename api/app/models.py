from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, SmallInteger, LargeBinary
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func



# ADMINISTRATORS

class Administrator(Base):
    __tablename__ = "administrators"
    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


role_enum = Enum("admin", "teacher", "student", name="role_enum")
status_enum = Enum("present", "absent", "late", name="status_enum")
access_status_enum = Enum("granted", "denied", name="access_status_enum")
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




# STUDENTS

class Student(Base):
    __tablename__ = "students"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    user = relationship("User")
    class_ = relationship("Class")




# TEACHERS

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    user = relationship("User")




# CLASSES

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, nullable=False)
    class_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)




# SCHEDULE

class Schedule(Base):
    __tablename__ = "schedule"
    id = Column(Integer, primary_key=True, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    subject = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    class_ = relationship("Class")
    room = relationship("Room")
    teacher = relationship("Teacher")




# ROOMS

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, nullable=False)
    room_name = Column(String, nullable=False)
    capacity = Column(SmallInteger, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)




# ATTENDANCES

class Attendances(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, nullable=False)
    student_id = Column(Integer, ForeignKey("students.user_id"), nullable=False)
    schedule_id = Column(Integer, ForeignKey("schedule.id"), nullable=False)
    status = Column(status_enum, nullable=False)
    manual_adjustment = Column(Boolean, nullable=False)
    created_at = Column(DateTime, nullable=False)
    
    student = relationship("Student")
    schedule = relationship("Schedule")




#ACCESS LOGS

class AccessLogs(Base):
    __tablename__ = "access_logs"
    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    access_time = Column(DateTime, nullable=False)
    access_status = Column(access_status_enum, nullable=False)
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    user = relationship("User")
    room = relationship("Room")
