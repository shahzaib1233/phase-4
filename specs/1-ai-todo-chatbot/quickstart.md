# Quickstart Guide: AI-Powered Todo Chatbot with Cohere Integration

**Feature**: 1-ai-todo-chatbot | **Date**: 2026-01-17

## Overview

This guide provides instructions for developers to set up and run the AI-Powered Todo Chatbot with Cohere Integration. Follow these steps to get the chatbot operational in your development environment.

## Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend development)
- PostgreSQL-compatible database (Neon DB connection)
- Better Auth configured (from Phase II)
- Cohere API key: `YOUR_COHERE_API_KEY_HERE`

## Environment Setup

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables in `.env`:**
   ```env
   # Database
   DATABASE_URL=postgresql://neondb_owner:npg_XwKLDv1o3CyM@ep-cool-cherry-abr7d232-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

   # Better Auth
   BETTER_AUTH_SECRET=your_better_auth_secret
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

   # Cohere Configuration
   COHERE_API_KEY=YOUR_COHERE_API_KEY_HERE
   COHERE_BASE_URL=https://api.cohere.ai/compatibility/v1
   COHERE_CHAT_MODEL=command-r-08-2024
   COHERE_TEMPERATURE=0.3
   COHERE_MAX_TOKENS=500
   ```

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   If no requirements.txt exists, install the required packages:
   ```bash
   pip install fastapi uvicorn sqlmodel python-multipart python-jose[cryptography] passlib[bcrypt] psycopg2-binary cohere openai python-multipart
   ```

3. **Run database migrations:**
   ```bash
   python -m src.database.migrate
   ```

4. **Start the backend server:**
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

## MCP Tools Setup

1. **Define MCP tools for task management:**
   - Navigate to `backend/src/tools/mcp_tools.py`
   - The tools should include: add_task, list_tasks, update_task, delete_task, get_task_details
   - Each tool should validate against the authenticated user's permissions

2. **Register MCP tools with the Cohere integration:**
   - Tools are registered in the chat service to be available to the AI model

## Chat Endpoint Usage

Once the server is running, you can interact with the chatbot using the following endpoint:

```
POST /api/{user_id}/chat
Headers:
  Authorization: Bearer {jwt_token}
Content-Type: application/json

Body:
{
  "message": "Add task buy groceries",
  "conversation_id": "optional_conversation_id"
}
```

## Testing the Integration

1. **Test the chat endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/user123/chat \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message": "Add task buy groceries"}'
   ```

2. **Verify conversation persistence:**
   - Check that conversations and messages are stored in the database
   - Verify that conversation history loads correctly for subsequent requests

## Frontend Integration

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

4. **Integrate with chat endpoint:**
   - Use existing auth context from Phase II
   - Connect to the `/api/{user_id}/chat` endpoint
   - Display conversation history and handle AI responses

## Troubleshooting

### Common Issues:

1. **Cohere API errors:**
   - Verify COHERE_API_KEY is correct
   - Check that COHERE_BASE_URL is set to the compatibility endpoint

2. **JWT authentication failures:**
   - Ensure BETTER_AUTH_SECRET matches between frontend and backend
   - Verify JWT token is being passed correctly in Authorization header

3. **Database connection issues:**
   - Confirm DATABASE_URL is correctly configured
   - Check that Neon DB is accessible from your network

### Useful Commands:

- **View conversation data:**
  ```sql
  SELECT * FROM conversations WHERE user_id = 'your_user_id';
  SELECT * FROM messages WHERE conversation_id = 'your_conversation_id' ORDER BY created_at;
  ```

- **Reset database (dev only):**
  ```bash
  python -m src.database.reset
  ```

## Development Tips

- The system uses a stateless design: conversation history is loaded from the database on each request
- All MCP tools validate user permissions to ensure proper task isolation
- Natural language processing uses Cohere's command-r model for optimal tool-calling capabilities
- Error handling provides user-friendly messages when operations fail