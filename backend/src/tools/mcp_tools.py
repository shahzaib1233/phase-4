"""MCP tools for task management in AI Todo Chatbot."""

import json
from typing import Dict, Any, List, Optional
from ..models.conversation import Message
from ...models import Task, User
from sqlmodel import select, Session, func
from datetime import datetime


def create_add_task_tool(session: Session):
    """Create the add_task MCP tool."""
    def add_task(title: str, description: Optional[str] = None, user_id: str = None) -> Dict[str, Any]:
        """
        Add a new task for the user.

        Args:
            title: The title of the task
            description: Optional description of the task
            user_id: The ID of the user who owns the task

        Returns:
            Dictionary with task creation result
        """
        if not user_id:
            return {"error": "user_id is required"}

        try:
            # Create new task
            task = Task(
                title=title,
                description=description,
                completed=False,
                user_id=user_id
            )

            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "message": f"Task '{title}' has been added successfully",
                "task_id": task.id,
                "task_title": task.title
            }
        except Exception as e:
            session.rollback()
            return {
                "error": f"Failed to add task: {str(e)}"
            }

    return add_task


def create_list_tasks_tool(session: Session):
    """Create the list_tasks MCP tool."""
    def list_tasks(user_id: str = None, status: Optional[str] = None) -> Dict[str, Any]:
        """
        List tasks for the user with optional filtering.

        Args:
            user_id: The ID of the user whose tasks to list
            status: Optional status filter ('all', 'completed', 'pending')

        Returns:
            Dictionary with list of tasks
        """
        if not user_id:
            return {"error": "user_id is required"}

        try:
            # Build query
            query = select(Task).where(Task.user_id == user_id)

            if status == "completed":
                query = query.where(Task.completed == True)
            elif status == "pending":
                query = query.where(Task.completed == False)

            tasks = session.exec(query).all()

            task_list = []
            for task in tasks:
                task_dict = {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat() if task.created_at else None
                }
                task_list.append(task_dict)

            return {
                "success": True,
                "tasks": task_list,
                "count": len(task_list),
                "message": f"Found {len(task_list)} tasks"
            }
        except Exception as e:
            return {
                "error": f"Failed to list tasks: {str(e)}"
            }

    return list_tasks


def create_update_task_tool(session: Session):
    """Create the update_task MCP tool."""
    def update_task(task_id: int, user_id: str = None, title: Optional[str] = None,
                   description: Optional[str] = None, completed: Optional[bool] = None) -> Dict[str, Any]:
        """
        Update an existing task for the user.

        Args:
            task_id: The ID of the task to update
            user_id: The ID of the user who owns the task
            title: New title (optional)
            description: New description (optional)
            completed: New completion status (optional)

        Returns:
            Dictionary with update result
        """
        if not user_id:
            return {"error": "user_id is required"}

        try:
            # Get the task
            task = session.get(Task, task_id)

            if not task:
                return {"error": f"Task with ID {task_id} not found"}

            if task.user_id != user_id:
                return {"error": "Access denied: You can only update your own tasks"}

            # Update fields if provided
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if completed is not None:
                task.completed = completed

            task.updated_at = datetime.utcnow()

            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "message": f"Task '{task.title}' has been updated successfully",
                "task_id": task.id,
                "updated_fields": {
                    "title": title,
                    "description": description,
                    "completed": completed
                }
            }
        except Exception as e:
            session.rollback()
            return {
                "error": f"Failed to update task: {str(e)}"
            }

    return update_task


def create_delete_task_tool(session: Session):
    """Create the delete_task MCP tool."""
    def delete_task(task_id: int, user_id: str = None) -> Dict[str, Any]:
        """
        Delete a task for the user.

        Args:
            task_id: The ID of the task to delete
            user_id: The ID of the user who owns the task

        Returns:
            Dictionary with deletion result
        """
        if not user_id:
            return {"error": "user_id is required"}

        try:
            # Get the task
            task = session.get(Task, task_id)

            if not task:
                return {"error": f"Task with ID {task_id} not found"}

            if task.user_id != user_id:
                return {"error": "Access denied: You can only delete your own tasks"}

            session.delete(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task '{task.title}' has been deleted successfully",
                "deleted_task_id": task_id
            }
        except Exception as e:
            session.rollback()
            return {
                "error": f"Failed to delete task: {str(e)}"
            }

    return delete_task


def create_get_task_details_tool(session: Session):
    """Create the get_task_details MCP tool."""
    def get_task_details(task_id: int, user_id: str = None) -> Dict[str, Any]:
        """
        Get detailed information about a specific task.

        Args:
            task_id: The ID of the task to get details for
            user_id: The ID of the user who owns the task

        Returns:
            Dictionary with task details
        """
        if not user_id:
            return {"error": "user_id is required"}

        try:
            # Get the task
            task = session.get(Task, task_id)

            if not task:
                return {"error": f"Task with ID {task_id} not found"}

            if task.user_id != user_id:
                return {"error": "Access denied: You can only access your own tasks"}

            return {
                "success": True,
                "task": {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None
                }
            }
        except Exception as e:
            return {
                "error": f"Failed to get task details: {str(e)}"
            }

    return get_task_details


# Tool registry for Cohere integration
def get_available_tools(session: Session):
    """Get all available MCP tools."""
    return [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user. Use this only when the user wants to add a new task, not to update or complete an existing one.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "The title of the new task"},
                        "description": {"type": "string", "description": "Optional description of the new task"},
                        "user_id": {"type": "string", "description": "The ID of the user who owns the task. Always provide this."}
                    },
                    "required": ["title", "user_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "list_tasks",
                "description": "List all tasks for the user with optional filtering. Use this when the user wants to see their tasks or get an overview.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string", "description": "The ID of the user whose tasks to list. Always provide this."},
                        "status": {"type": "string", "description": "Optional status filter ('all', 'completed', 'pending')"}
                    },
                    "required": ["user_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "update_task",
                "description": "Update an existing task for the user. Use this when the user wants to mark a task as complete, change its title, description, or any other property. The task_id is required.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The ID of the task to update. This is required for any update operation."},
                        "user_id": {"type": "string", "description": "The ID of the user who owns the task. Always provide this."},
                        "title": {"type": "string", "description": "New title (optional)"},
                        "description": {"type": "string", "description": "New description (optional)"},
                        "completed": {"type": "boolean", "description": "New completion status (true for completed, false for incomplete). Use this specifically to mark tasks as complete/incomplete."}
                    },
                    "required": ["task_id", "user_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "delete_task",
                "description": "Delete a task for the user. Use this only when the user explicitly asks to delete a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The ID of the task to delete"},
                        "user_id": {"type": "string", "description": "The ID of the user who owns the task. Always provide this."}
                    },
                    "required": ["task_id", "user_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_task_details",
                "description": "Get detailed information about a specific task. Use this when the user wants details about a particular task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The ID of the task to get details for"},
                        "user_id": {"type": "string", "description": "The ID of the user who owns the task. Always provide this."}
                    },
                    "required": ["task_id", "user_id"]
                }
            }
        }
    ]


def execute_tool_call(tool_name: str, arguments: Dict[str, Any], session: Session):
    """Execute a tool call based on the tool name and arguments."""
    if tool_name == "add_task":
        tool_func = create_add_task_tool(session)
        return tool_func(**arguments)
    elif tool_name == "list_tasks":
        tool_func = create_list_tasks_tool(session)
        return tool_func(**arguments)
    elif tool_name == "update_task":
        tool_func = create_update_task_tool(session)
        return tool_func(**arguments)
    elif tool_name == "delete_task":
        tool_func = create_delete_task_tool(session)
        return tool_func(**arguments)
    elif tool_name == "get_task_details":
        tool_func = create_get_task_details_tool(session)
        return tool_func(**arguments)
    else:
        return {"error": f"Unknown tool: {tool_name}"}