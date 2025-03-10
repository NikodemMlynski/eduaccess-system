from fastapi import status, Depends, HTTPException, APIRouter
from app.schemas import teacher, user
from app.models import Teacher
from app.database import get_db
from sqlalchemy.orm import Session
from app import models
from typing import List
router = APIRouter(
    prefix="/teachers",
    tags=["teachers"],
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=user.UserOut)
def create_teacher(
    teacher: user.UserIn,
    db: Session = Depends(get_db)
):
    # restrict to admin first 
    print(teacher.email)
    existing_teacher_user = db.query(models.User).filter(
        models.User.email == teacher.email
    ).first()
    if existing_teacher_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Teacher with that email already exist")
    
    new_user = models.User(**teacher.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if not new_user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create teacher 1")

    new_teacher = models.Teacher(**{"user_id": new_user.id})
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    
    return new_user
# , response_model=List[teacher.TeacherOut]
@router.get("/", response_model=List[teacher.TeacherOut])
def get_teachers(db: Session = Depends(get_db)):
    teachers = (
        db.query(models.Teacher, models.User)
        .join(models.User, models.Teacher.user_id == models.User.id)
        .all()
    )

    teachers_out = [
        teacher.TeacherOut(
            id=t.id,
            created_at=t.created_at,
            updated_at=t.updated_at,
            user=user.UserOut(
                id=u.id,
                first_name=u.first_name,
                last_name=u.last_name,
                email=u.email,
                role=u.role,
                created_at=u.created_at,
                updated_at=u.updated_at
            )
        )
        for t, u in teachers 
    ]

    return teachers_out