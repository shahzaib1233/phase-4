"""Chat router for AI Todo Chatbot with JWT authentication."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
from ..models.conversation import ChatRequest, ChatResponse
from ..services.chat_service import create_chat_service
from ...db import get_session as get_db_session
from ...auth import verify_jwt_token
from datetime import datetime


router = APIRouter(prefix="/api/{user_id}", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    chat_request: ChatRequest,
    token: str = Depends(verify_jwt_token),
    session: Session = Depends(get_db_session)
):
    """
    Chat endpoint that accepts user messages and returns AI responses with potential tool calls.

    Args:
        user_id: The ID of the authenticated user (from path)
        chat_request: The chat request containing message and optional conversation_id
        token: The JWT token for authentication (verified by dependency)
        session: Database session (provided by dependency)

    Returns:
        ChatResponse with AI response and tool calls
    """
    # Verify that the user_id in the token matches the user_id in the path
    # This ensures users can only access their own conversations
    # The user ID is stored in the 'sub' field of the JWT token
    token_user_id = token.get("sub")
    # Debug: Compare the actual values
    if token_user_id != user_id:
        print(f"DEBUG: token_user_id='{token_user_id}' (type: {type(token_user_id)}), user_id='{user_id}' (type: {type(user_id)})")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: Token user_id '{token_user_id}' does not match path user_id '{user_id}'"
        )

    try:
        # Create chat service instance
        chat_service = create_chat_service(session)

        # Process the chat request
        response = await chat_service.process_chat(
            user_id=user_id,
            chat_request=chat_request
        )

        return response

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing your request: {str(e)}"
        )


# Additional endpoints for conversation management could be added here
@router.get("/conversations")
async def list_user_conversations(
    user_id: str,
    token: str = Depends(verify_jwt_token),
    session: Session = Depends(get_db_session)
):
    """
    Get list of user's conversations.

    Args:
        user_id: The ID of the authenticated user
        token: The JWT token for authentication
        session: Database session

    Returns:
        List of user's conversations
    """
    # Verify user authorization
    token_user_id = token.get("sub")
    if token_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own conversations"
        )

    # Debug: Compare the actual values
    if token_user_id != user_id:
        print(f"DEBUG: token_user_id='{token_user_id}' (type: {type(token_user_id)}), user_id='{user_id}' (type: {type(user_id)})")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: Token user_id '{token_user_id}' does not match path user_id '{user_id}'"
        )

    # Query user's conversations
    statement = select(Conversation).where(Conversation.user_id == user_id)
    conversations = session.exec(statement).all()

    return {
        "conversations": [
            {
                "id": conv.id,
                "user_id": conv.user_id,
                "created_at": conv.created_at.isoformat(),
                "updated_at": conv.updated_at.isoformat()
            }
            for conv in conversations
        ],
        "count": len(conversations)
    }


@router.get("/conversations/{conversation_id}")
async def get_conversation_details(
    user_id: str,
    conversation_id: str,
    token: str = Depends(verify_jwt_token),
    session: Session = Depends(get_db_session)
):
    """
    Get details of a specific conversation.

    Args:
        user_id: The ID of the authenticated user
        conversation_id: The ID of the conversation to retrieve
        token: The JWT token for authentication
        session: Database session

    Returns:
        Details of the conversation and its messages
    """
    # Debug: Compare the actual values
    token_user_id = token.get("sub")
    if token_user_id != user_id:
        print(f"DEBUG: token_user_id='{token_user_id}' (type: {type(token_user_id)}), user_id='{user_id}' (type: {type(user_id)})")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: Token user_id '{token_user_id}' does not match path user_id '{user_id}'"
        )

    # Import here to avoid circular imports
    from sqlmodel import select
    from ..models.conversation import Conversation, Message

    # Get conversation
    conversation = session.get(Conversation, conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    # Verify conversation belongs to user
    if conversation.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own conversations"
        )

    # Get messages in conversation
    message_statement = select(Message).where(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at)
    messages = session.exec(message_statement).all()

    return {
        "conversation": {
            "id": conversation.id,
            "user_id": conversation.user_id,
            "created_at": conversation.created_at.isoformat(),
            "updated_at": conversation.updated_at.isoformat()
        },
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat()
            }
            for msg in messages
        ],
        "message_count": len(messages)
    }