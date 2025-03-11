from pydantic import BaseModel

class AdminIn(BaseModel):
    user_id: int 