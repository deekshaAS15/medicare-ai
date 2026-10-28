import hashlib
import secrets
import os
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import User, Admin,PasswordResetToken
from schemas import (UserCreate, UserResponse, UserLogin, Token , AdminCreate)
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(
        user_data.password
    )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        phone=user_data.phone
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
    "/login",
    response_model=Token
)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = pwd_context.verify(
        user_data.password,
        user.password
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/admin/login")
def admin_login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    admin = (
        db.query(Admin)
        .filter(Admin.email == user_data.email)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin email or password"
        )

    password_correct = pwd_context.verify(
        user_data.password,
        admin.password
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin email or password"
        )

    access_token = create_access_token({
        "sub": str(admin.id),
        "email": admin.email,
        "role": "admin"
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        user = db.query(User).filter(
            User.id == int(user_id)
        ).first()

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        admin_id = payload.get("sub")
        role = payload.get("role")

        if admin_id is None or role != "admin":
            raise HTTPException(
                status_code=401,
                detail="Invalid admin token"
            )

        admin = (
            db.query(Admin)
            .filter(Admin.id == int(admin_id))
            .first()
        )

        if admin is None:
            raise HTTPException(
                status_code=401,
                detail="Admin not found"
            )

        return admin

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired admin token"
        )

@router.post("/admin/setup")
def create_first_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db)
):
    existing_admin = db.query(Admin).first()

    if existing_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin account already exists"
        )

    hashed_password = pwd_context.hash(admin_data.password)

    new_admin = Admin(
        name=admin_data.name,
        email=admin_data.email,
        password=hashed_password
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {
        "message": "Admin account created successfully"
    }

@router.post("/forgot-password")
def forgot_password(
    email: str,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # Always return the same message to avoid revealing
    # whether an email is registered.
    message = (
        "If an account exists for this email, "
        "password reset instructions will be provided."
    )

    if not user:
        return {"message": message}

    # Invalidate previous unused reset tokens for this user.
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == 0,
    ).delete(synchronize_session=False)

    # Generate a secure, random token.
    reset_token = secrets.token_urlsafe(32)

    # Store only its SHA-256 hash.
    token_hash = hashlib.sha256(
        reset_token.encode()
    ).hexdigest()

    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
        used=0,
    )

    db.add(reset_record)
    db.commit()

    # DEVELOPMENT ONLY:
    return {
        "message": message,
        "development_reset_token": reset_token,
    }

@router.post("/reset-password")
def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    token_hash = hashlib.sha256(
        token.encode()
    ).hexdigest()

    reset_record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used == 0,
        )
        .first()
    )

    if not reset_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or already-used reset token",
        )

    # Handle timezone-aware and timezone-naive database values.
    expires_at = reset_record.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="Reset token has expired. Please request a new one.",
        )

    # Validate password strength.
    import re

    strong_password = re.compile(
        r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)"
        r"(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
    )

    if not strong_password.fullmatch(new_password):
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must contain at least 8 characters, "
                "including uppercase, lowercase, a number, "
                "and a special character."
            ),
        )

    user = db.query(User).filter(
        User.id == reset_record.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="User account not found",
        )

    user.password = pwd_context.hash(new_password)
    reset_record.used = 1

    # Invalidate any other outstanding tokens for this user.
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.id != reset_record.id,
        PasswordResetToken.used == 0,
    ).update(
        {"used": 1},
        synchronize_session=False,
    )

    db.commit()

    return {
        "message": "Password reset successful. Please log in."
    }