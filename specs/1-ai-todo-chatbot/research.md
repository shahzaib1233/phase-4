# Research: AI-Powered Todo Chatbot with Cohere Integration

**Feature**: 1-ai-todo-chatbot | **Date**: 2026-01-17

## Overview

This research document addresses technical unknowns and establishes best practices for implementing the AI-Powered Todo Chatbot with Cohere Integration. The research covers Cohere API compatibility, MCP tool patterns, conversation management, and authentication integration.

## 1. Cohere API Integration via OpenAI-Compatible Endpoint

### Decision: Use OpenAI SDK with Cohere Compatibility API
**Rationale**: Cohere provides an OpenAI-compatible endpoint that allows us to use the familiar OpenAI Python SDK while routing requests to Cohere's services. This approach minimizes code changes while leveraging Cohere's AI capabilities.

### Technical Details:
- Base URL: `https://api.cohere.ai/compatibility/v1`
- API Key: `YOUR_COHERE_API_KEY_HERE`
- Model: `command-r-08-2024` (recommended for strong tool use)
- Temperature: `0.3` (for more deterministic responses)
- Max Tokens: `500` (appropriate for chat responses)

### Alternatives Considered:
- Direct Cohere SDK: Would require different implementation patterns
- OpenAI API: Would incur OpenAI costs instead of using free Cohere tier

## 2. MCP Tool Definition and Server Setup

### Decision: Implement MCP tools for task management operations
**Rationale**: MCP (Model Context Protocol) tools allow the AI agent to call specific functions when needed, enabling natural language processing to trigger specific actions like adding, listing, updating, or deleting tasks.

### Tool Specifications:
1. **add_task**: Creates a new task for the authenticated user
2. **list_tasks**: Retrieves tasks for the authenticated user with filters
3. **update_task**: Modifies an existing task (status, title, etc.)
4. **delete_task**: Removes a task from the user's list
5. **get_task_details**: Gets detailed information about a specific task

### Implementation Pattern:
- Tools will be defined using OpenAI-compatible function definitions
- Each tool will validate against the authenticated user's permissions
- Error handling will provide user-friendly messages for failed operations

## 3. Stateless Conversation Management

### Decision: Load full conversation history from DB on every request
**Rationale**: Stateless design ensures scalability and simplifies deployment. Loading conversation history from the database on each request maintains context without server-side session storage.

### Technical Approach:
- Conversation model: Stores conversation metadata (user_id, created_at, updated_at)
- Message model: Stores individual messages (role, content, timestamp, conversation_id)
- On each chat request: Load all messages for the conversation from DB
- Append new user message and save AI response to DB
- Pass full conversation history to the AI model for context

### Alternatives Considered:
- Server-side session storage: Would complicate scaling and state management
- Client-side history management: Would be less secure and reliable

## 4. JWT Authentication Integration

### Decision: Extend existing Better Auth JWT validation
**Rationale**: Leverage existing authentication infrastructure from Phase II while ensuring user isolation for conversation data.

### Implementation Pattern:
- Verify JWT token on each chat endpoint request
- Extract user_id from token payload
- Validate that user_id matches the conversation being accessed
- Ensure MCP tools validate user permissions when performing task operations

## 5. Database Schema Extensions

### Decision: Add Conversation and Message models to existing database
**Rationale**: Extend current database schema to support conversation persistence while maintaining consistency with existing models.

### Proposed Schema:
- `conversations` table: id, user_id (FK to users), created_at, updated_at
- `messages` table: id, conversation_id (FK to conversations), user_id (FK to users), role (user/assistant), content, created_at
- Proper indexing on user_id and conversation_id for performance
- Using Neon DB URL: postgresql://neondb_owner:npg_XwKLDv1o3CyM@ep-cool-cherry-abr7d232-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

## 6. Error Handling and User Experience

### Decision: Implement graceful error handling with natural language responses
**Rationale**: Provide helpful feedback to users when operations fail while maintaining the conversational experience.

### Patterns:
- Catch database errors and return user-friendly messages
- Handle AI service errors gracefully
- Provide contextual help when user intent is unclear
- Maintain conversation flow even when individual operations fail

## 7. Natural Language Processing Strategy

### Decision: Use Cohere's command-r model for its strong tool-calling capabilities
**Rationale**: The command-r model is specifically designed for tool usage and can effectively interpret natural language into structured API calls.

### Expected Interactions:
- "Add task buy groceries" → calls add_task with "buy groceries"
- "Show pending tasks" → calls list_tasks with status filter
- "Complete task 3" → calls update_task with ID 3 and completed status
- "Delete the old meeting" → calls delete_task with appropriate identification