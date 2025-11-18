# backend/src/routes/campus.py

from fastapi import APIRouter
from backend.src import db
from backend.src.schemas.campus import CampusOut

router = APIRouter(prefix="/api", tags=["campus"])

@router.get("/campus", response_model=list[CampusOut])
async def get_campuses():
    campuses = await db.fetch("SELECT campusid, dropoff FROM campus")
    return [{"campusID": c["campusid"], "dropOff": c["dropoff"]} for c in campuses]