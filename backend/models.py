from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Index

class UserBase(SQLModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(unique=True, min_length=5, max_length=255)

class User(UserBase, table=True):
    """
    User model for authentication
    """
    __table_args__ = (
        Index("idx_email", "email"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(min_length=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(nullable=False)

class Task(TaskBase, table=True):
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_completed", "completed"),
        Index("idx_user_id_completed", "user_id", "completed"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskPatch(SQLModel):
    completed: Optional[bool] = None

class UserCreate(UserBase):
    """
    Schema for creating a new user
    """
    password: str

class UserRead(UserBase):
    """
    Schema for reading a user
    """
    id: int
    created_at: datetime
    updated_at: datetime
