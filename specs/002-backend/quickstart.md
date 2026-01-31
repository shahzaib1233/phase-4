# Quickstart Guide: Secure & Production-Ready Backend for Phase II Todo Web App

## Prerequisites

- Python 3.11+
- Poetry or pip for dependency management
- Neon PostgreSQL database access
- BETTER_AUTH_SECRET for JWT validation

## Environment Setup

Create a `.env` file with the following variables:

```bash
DATABASE_URL=your_database_url_here
BETTER_AUTH_SECRET=your_auth_secret_here
```

## Dependencies Installation

```bash
pip install fastapi sqlmodel pyjwt python-multipart python-jose[cryptography] psycopg2-binary
```

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── models.py            # SQLModel task model
├── db.py                # Database connection and session
├── dependencies.py      # JWT verification middleware and dependencies
└── routes/
    └── tasks.py         # Task CRUD endpoint implementations
```

## Running the Application

```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

- GET `/api/{user_id}/tasks` - List tasks with optional status and sort query params
- POST `/api/{user_id}/tasks` - Create new task
- GET `/api/{user_id}/tasks/{id}` - Get specific task
- PUT `/api/{user_id}/tasks/{id}` - Update task
- DELETE `/api/{user_id}/tasks/{id}` - Delete task
- PATCH `/api/{user_id}/tasks/{id}/complete` - Toggle completed status

## Authentication

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Testing the API

Use the following curl command to test the API (replace with actual JWT token):

```bash
curl -X GET "http://localhost:8000/api/user123/tasks" \
  -H "Authorization: Bearer your_jwt_token_here"
```