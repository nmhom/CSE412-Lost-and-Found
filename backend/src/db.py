# backend/src/db.py
import os, asyncpg
from dotenv import load_dotenv

# load environment variables
load_dotenv(dotenv_path="backend/.env")
database_url = os.getenv("DATABASE_URL") # url mentioned in .env file

# return a single row (like one user)
async def fetchrow(query, *params):
    conn = await asyncpg.connect(database_url)
    try:
        return await conn.fetchrow(query, *params)
    finally:
        await conn.close()

# return multiple rows (like all items)
async def fetch(query, *params):
    conn = await asyncpg.connect(database_url)
    try:
        return await conn.fetch(query, *params)
    finally:
        await conn.close()

# doesn’t return rows (like INSERT, UPDATE, DELETE)
async def execute(query, *params):
    conn = await asyncpg.connect(database_url)
    try:
        return await conn.execute(query, *params)
    finally:
        await conn.close()

