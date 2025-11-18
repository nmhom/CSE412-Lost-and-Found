# backend/src/main.py
from fastapi import FastAPI
from backend.src.routes import auth, campus

app = FastAPI()
app.include_router(auth.router)
app.include_router(campus.router)
