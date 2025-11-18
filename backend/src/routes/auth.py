#This file handles user registration, login, and verifying JWT tokens for authentication.

# imports
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext  # For password hashing securely
from jose import jwt  # to create and decode JWT tokens
import os
from backend.src import db  # database helper module
from backend.src.schemas.user import UserCreate, UserOut, TokenResponse  # data validation models

from dotenv import load_dotenv  # Loads environment variables from .env file

# load environment variables from .env file
load_dotenv()  

# create a router so all authentication routes share the base path "/api/auth"
router = APIRouter(prefix="/api/auth", tags=["auth"])

# password hashing (PBKDF2 is a secure algorithm)
pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# secret key and algorithm used for JWT tokens
JWT_SECRET = os.getenv("JWT_SECRET", "default_key__123456")  # set default key
ALGORITHM = "HS256"  # JWT encryption algorithm

# make sure the password is no longer than 72 bytes to maintain consistency
def _passtrunc_to_72(password: str) -> str:
    if password is None:
        return password
    b = password.encode("utf-8")
    if len(b) <= 72:
        return password
    return b[:72].decode("utf-8", errors="ignore")

# User Registration
@router.post("/register", response_model=UserOut)
async def register(payload: UserCreate):

    # Check if email is already used
    existing = await db.fetchrow("SELECT * FROM users WHERE email=$1", payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password before storing
    hashed = pwd_ctx.hash(_passtrunc_to_72(payload.password))

    # Insert the new user into the database
    row = await db.fetchrow(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1,$2,$3,$4) "
        "RETURNING userid, firstname, lastname, email",
        payload.firstName, payload.lastName, payload.email, hashed
    )

    if not row:
        raise HTTPException(status_code=500, detail="Failed to create user")

    # Return user info (without password)
    return {
        "userID": row.get("userid"),
        "firstName": row.get("firstname"),
        "lastName": row.get("lastname"),
        "email": row.get("email")
    }

# User Login
@router.post("/login", response_model=TokenResponse)
async def login(form_data: dict):

    email = form_data.get("email")
    password = form_data.get("password")

    # both fields are here 
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password")

    # find user by email
    user = await db.fetchrow("SELECT * FROM users WHERE email=$1", email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # check password
    stored = user.get("password")
    if not stored or not pwd_ctx.verify(_passtrunc_to_72(password), stored):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # create a JWT token containing user ID and email
    token = jwt.encode(
        {"userID": user.get("userid"), "email": user.get("email")},
        JWT_SECRET,
        algorithm=ALGORITHM
    )

    # return token and user ID
    return {"access_token": token, "userID": user.get("userid")}

# Get User Info
auth_scheme = HTTPBearer()  # This enforces that a bearer token must be included

@router.get("/me")
async def me(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):

    token = credentials.credentials
    try:
        # decode token using the secret and algorithm
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return {"user": payload}
    except Exception:
        # If token is invalid or expired
        raise HTTPException(status_code=401, detail="Invalid token")
