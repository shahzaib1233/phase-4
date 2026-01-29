from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
from ..models import Task, TaskCreate, TaskRead, TaskUpdate, TaskPatch
from ..dependencies import get_current_user
from ..db import get_session


router = APIRouter()

@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task: TaskCreate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the specified user.
    The user_id in the path must match the user_id from the JWT token.
    """
    # Verify that the user_id in the path matches the user from the JWT token
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    # Create the task with the user_id from the path/verification
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task

@router.get("/tasks", response_model=List[TaskRead])
def read_tasks(
    user_id: str,
    status: str = None,  # Optional query param: "completed", "pending"
    sort: str = None,    # Optional query param: "created_asc", "created_desc", "updated_asc", "updated_desc"
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the specified user.
    The user_id in the path must match the user_id from the JWT token.
    Supports optional query parameters for filtering and sorting.
    """
    # Verify that the user_id in the path matches the user from the JWT token
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )

    # Start building the query
    statement = select(Task).where(Task.user_id == user_id)

    # Apply status filter if provided
    if status == "completed":
        statement = statement.where(Task.completed == True)
    elif status == "pending":
        statement = statement.where(Task.completed == False)

    # Apply sorting if provided
    if sort == "created_asc":
        statement = statement.order_by(Task.created_at.asc())
    elif sort == "created_desc":
        statement = statement.order_by(Task.created_at.desc())
    elif sort == "updated_asc":
        statement = statement.order_by(Task.updated_at.asc())
    elif sort == "updated_desc":
        statement = statement.order_by(Task.updated_at.desc())
    else:
        # Default sorting: by creation date, newest first
        statement = statement.order_by(Task.created_at.desc())

    # Execute the query
    tasks = session.exec(statement).all()

    return tasks

@router.get("/tasks/{task_id}", response_model=TaskRead)
def read_task(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task for the specified user.
    The user_id in the path must match the user_id from the JWT token.
    """
    # Verify that the user_id in the path matches the user from the JWT token
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )

    # Query the specific task for the authenticated user only
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task

@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task for the specified user.
    The user_id in the path must match the user_id from the JWT token.
    """
    # Verify that the user_id in the path matches the user from the JWT token
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    # Query the specific task for the authenticated user only
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update the task with provided values
    task_data = task_update.model_dump(exclude_unset=True)
    for field, value in task_data.items():
        setattr(db_task, field, value)

    # Update the updated_at timestamp
    db_task.updated_at = datetime.utcnow()

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task for the specified user.
    The user_id in the path must match the user_id from the JWT token.
    """
    # Verify that the user_id in the path matches the user from the JWT token
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user"
        )

    # Query the specific task for the authenticated user only
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(db_task)
    session.commit()

    return

@router.patch("/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_task_completion(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task for the specified user.
    The user_id in the path must match the user_id from the JWT token.
    """
    # Verify that the user_id in the path matches the user from the JWT token
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to toggle completion status for this user"
        )

    # Query the specific task for the authenticated user only
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle the completion status
    db_task.completed = not db_task.completed
    # Update the updated_at timestamp
    db_task.updated_at = datetime.utcnow()

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task