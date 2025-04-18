from typing import Generic, TypeVar, List 
from pydantic import BaseModel
from pydantic.generics import GenericModel 

T = TypeVar("T")

class PaginatedResponse(GenericModel, Generic[T]):
    total_count: int 
    has_next_page: bool 
    users: List[T]