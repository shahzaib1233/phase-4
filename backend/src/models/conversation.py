"""Conversation and Message models for AI Todo Chatbot."""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid
from enum import Enum

class RoleType(str, Enum):
    user = "user"
    assistant = "assistant"

class ConversationBase(SQLModel):
    user_id: str = Field(index=True)


class Conversation(ConversationBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")


class MessageBase(SQLModel):
    conversation_id: str = Field(foreign_key="conversation.id", index=True)
    user_id: str = Field(index=True)
    role: str = Field(regex="^(user|assistant)$")
    content: str = Field(max_length=10000)


class Message(MessageBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Conversation = Relationship(back_populates="messages")


# Pydantic models for API requests/responses
class ChatRequest(SQLModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(SQLModel):
    response: str
    conversation_id: str
    tool_calls: Optional[List[dict]] = []