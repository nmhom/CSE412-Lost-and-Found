# backend/src/routes/auth.py

#imports
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import jwt
import os
from backend.src import db
from backend.src.schemas.user import UserCreate, UserOut, TokenResponse
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret_demo_key")
ALGORITHM = "HS256"

def _pw_truncate_to_72(password: str) -> str:
    if password is None:
        return password
    b = password.encode("utf-8")
    if len(b) <= 72:
        return password
    return b[:72].decode("utf-8", errors="ignore")

# new user registers
@router.post("/register", response_model=UserOut)
async def register(payload: UserCreate):
    existing = await db.fetchrow("SELECT * FROM users WHERE email=$1", payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = pwd_ctx.hash(_pw_truncate_to_72(payload.password))
    row = await db.fetchrow(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1,$2,$3,$4) RETURNING userid, firstname, lastname, email",
        payload.firstName, payload.lastName, payload.email, hashed
    )
    if not row:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return {"userID": row.get("userid"), "firstName": row.get("firstname"), "lastName": row.get("lastname"), "email": row.get("email")}

# existing users login
@router.post("/login", response_model=TokenResponse)
async def login(form_data: dict):
    email = form_data.get("email"); password = form_data.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password")
    user = await db.fetchrow("SELECT * FROM users WHERE email=$1", email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    stored = user.get("password")
    if not stored or not pwd_ctx.verify(_pw_truncate_to_72(password), stored):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"userID": user.get("userid"), "email": user.get("email")}, JWT_SECRET, algorithm=ALGORITHM)
    return {"access_token": token, "userID": user.get("userid")}

# decodes JWT and returns the payload
auth_scheme = HTTPBearer()
@router.get("/me")
async def me(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return {"user": payload}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
