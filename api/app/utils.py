from fastapi import Query, HTTPException
from datetime import datetime


weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
def get_weekday(index):
    return weekdays[index]


def validate_date(date_str: str = Query(..., description="Date in YYYY-MM-DD format")) -> datetime:
    try:
        parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        return parsed_date
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="Date must be in format YYYY-MM-DD"
        )
