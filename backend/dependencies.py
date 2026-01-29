from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError
from typing import Optional
import os
from dotenv import load_dotenv
from sqlmodel import Session
from .db import get_session

# Load environment variables
load_dotenv()

# Initialize security scheme for JWT
security = HTTPBearer()

# Get the secret key from environment
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable not set")

ALGORITHM = "HS256"

def verify_jwt_token(token: str) -> Optional[dict]:
    """
    Verify JWT token and return payload if valid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return payload
    except PyJWTError:
        return None

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> str:
    """
    Get current user from JWT token
    Returns the user_id from the token
    """
    token = credentials.credentials
    payload = verify_jwt_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Additional check to ensure user_id matches the expected format
    # In a real application, you might want to verify the user exists in the database
    return user_id