from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel
import os

# ----------------- JWT CONFIG -----------------
# ΑΛΛΑΞΤΕ ΤΟ! Χρησιμοποιήστε ένα μεγάλο, τυχαίο string
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-ultra-secure-secret-key-here-1234567890") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ----------------- PASSWORD HASHING CONFIG -----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----------------- UTILS -----------------

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "user_id": str(data["user_id"])})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ----------------- Pydantic Models for Auth -----------------

class Token(BaseModel):
    access_token: str
    token_type: str
    user_data: dict 

class User(BaseModel):
    id: str
    email: str
    nickname: str

class UserCreate(BaseModel):
    email: str
    password: str
    nickname: str