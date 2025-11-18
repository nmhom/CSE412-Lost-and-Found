from pydantic import BaseModel

class CampusOut(BaseModel):
    campusID: int
    dropOff: str