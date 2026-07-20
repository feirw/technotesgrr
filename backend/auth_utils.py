import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt

# Falls back to a random per-process secret if not configured, so local dev still
# works — but this means sessions won't survive a restart. Set JWT_SECRET_KEY in
# production so tokens stay valid across deploys/restarts.
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or secrets.token_hex(32)
JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day — default session
REMEMBER_ME_EXPIRE_DAYS = 30  # "Remember me" checked


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def access_token_max_age_seconds(remember_me: bool) -> int:
    delta = (
        timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
        if remember_me
        else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return int(delta.total_seconds())


def create_access_token(user_id: int, email: str, remember_me: bool = False) -> str:
    expire_at = datetime.now(timezone.utc) + timedelta(
        seconds=access_token_max_age_seconds(remember_me)
    )
    payload = {"sub": str(user_id), "email": email, "exp": expire_at}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)
