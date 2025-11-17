# backend/src/db.py
import os, asyncpg
from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/.env")
DATABASE_URL = os.getenv("DATABASE_URL")

async def fetchrow(query: str, *params):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        return await conn.fetchrow(query, *params)
    finally:
        await conn.close()

async def fetch(query: str, *params):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        return await conn.fetch(query, *params)
    finally:
        await conn.close()

async def execute(query: str, *params):
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        return await conn.execute(query, *params)
    finally:
        await conn.close()
