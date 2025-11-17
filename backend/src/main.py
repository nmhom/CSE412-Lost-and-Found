# backend/src/main.py
from fastapi import FastAPI
from backend.src.routes import auth

app = FastAPI()
app.include_router(auth.router)
