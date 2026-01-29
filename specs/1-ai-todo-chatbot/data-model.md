# Data Model: AI-Powered Todo Chatbot with Cohere Integration

**Feature**: 1-ai-todo-chatbot | **Date**: 2026-01-17

## Overview

This document defines the data models for the AI-Powered Todo Chatbot with Cohere Integration, extending the existing Phase II database schema to support conversation persistence while maintaining user isolation and security.

## 1. Conversation Entity

### Fields
- `id`: UUID (Primary Key) - Unique identifier for the conversation
- `user_id`: UUID (Foreign Key) - References the authenticated user (from Better Auth)
- `created_at`: DateTime (Default: now) - Timestamp when conversation started
- `updated_at`: DateTime (Auto-update) - Timestamp of last activity

### Relationships
- One-to-many with `Message` entity (one conversation contains many messages)
- Many-to-one with `User` entity (many conversations belong to one user)

### Validation Rules
- `user_id` must reference an existing user
- Both timestamps are immutable after creation (updated_at auto-updates)
- Cannot be created without valid JWT authentication

## 2. Message Entity

### Fields
- `id`: UUID (Primary Key) - Unique identifier for the message
- `conversation_id`: UUID (Foreign Key) - References the parent conversation
- `user_id`: UUID (Foreign Key) - References the message author (for validation)
- `role`: String (Enum: 'user' | 'assistant') - Indicates message sender
- `content`: Text - The actual message content
- `created_at`: DateTime (Default: now) - Timestamp when message was created

### Relationships
- Many-to-one with `Conversation` entity (many messages belong to one conversation)
- Many-to-one with `User` entity (for user isolation validation)

### Validation Rules
- `conversation_id` must reference an existing conversation
- `user_id` must match the authenticated user or be 'assistant'
- `role` must be either 'user' or 'assistant'
- `content` must not exceed 10,000 characters (prevent abuse)

## 3. Integration with Existing Models

### Relationship with Phase II Task Model
- The existing `Task` model remains unchanged
- MCP tools will operate on the existing `Task` model
- User isolation is maintained through existing `user_id` foreign key in `tasks` table

### Security Considerations
- All queries filter by `user_id` to enforce user isolation
- Conversation access restricted to owning user
- Message access restricted to conversation owner

## 4. Database Constraints

### Primary Keys
- All entities use UUID primary keys for global uniqueness

### Foreign Keys
- `conversations.user_id` → `users.id` (Better Auth user table)
- `messages.conversation_id` → `conversations.id`
- `messages.user_id` → `users.id` (for validation)

### Indexes
- `conversations.user_id` - For efficient user conversation retrieval
- `messages.conversation_id` - For efficient conversation message retrieval
- `messages.created_at` - For chronological message ordering
- Composite: `(user_id, created_at)` - For efficient user timeline queries

### Connection
- Database connection uses: postgresql://neondb_owner:npg_XwKLDv1o3CyM@ep-cool-cherry-abr7d232-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

## 5. Sample SQLModel Definitions

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid

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
```

## 6. State Transitions

### Conversation Lifecycle
1. **Created**: When user initiates first chat session
2. **Active**: When messages are exchanged (updated_at refreshed)
3. **Inactive**: When no activity for extended period (soft state, no explicit transition)

### Message Lifecycle
- **Created**: When user sends message or AI responds
- **Stored**: Persisted in database with timestamp
- **Retrieved**: Loaded as part of conversation history for context

## 7. Data Integrity Rules

- Referential integrity enforced by database constraints
- Cascade deletion: Deleting conversation removes all associated messages
- User ownership validation at application layer (JWT authentication)
- Immutable message content after creation