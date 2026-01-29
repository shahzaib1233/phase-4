from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Index

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(nullable=False)

class Task(TaskBase, table=True):
    """
    Task model representing a user's task
    """
    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_completed", "completed"),
        Index("idx_user_id_completed", "user_id", "completed"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class TaskCreate(TaskBase):
    """
    Schema for creating a new task
    """
    pass

class TaskRead(TaskBase):
    """
    Schema for reading a task
    """
    id: int
    created_at: datetime
    updated_at: datetime

class TaskUpdate(SQLModel):
    """
    Schema for updating a task
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None

class TaskPatch(SQLModel):
    """
    Schema for patching a task (for toggling completion)
    """
    completed: Optional[bool] = None
