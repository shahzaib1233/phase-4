# Feature Specification: Secure & Production-Ready Backend for Phase II Todo Web App

**Feature Branch**: `002-backend`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Secure & Production-Ready Backend for Phase II Todo Web App
Target audience: The FastAPI backend serving the professional frontend, Neon PostgreSQL database, and Better Auth JWT authentication system — ensuring secure, efficient, and reliable task management for multiple users.
Focus: Implement a secure, high-performance, and maintainable Python FastAPI backend using SQLModel, fully integrated with Neon Serverless PostgreSQL and Better Auth JWT authentication, providing all required RESTful task CRUD endpoints with strict user isolation.
Success criteria:

All REST API endpoints exactly match @specs/api/rest-endpoints.md
Every endpoint ollow backend/CLAUDE.md conventions exactly
Reference and update @specs/database/schema.md and @specs/api/rest-endpoints.md
No manual coding — generate via Claude Code agents and skills only

Required Endpoints (must implement exactly):

GET /api/{user_id}/tasks → List tasks (with optional status and sort query params)
POST /api/{user_id}/tasks → Create new task
GET /api/{user_id}/tasks/{id} → Getrequires a valid JWT token in Authorization: Bearer header
User ownership strictly enforced: user_id from decoded JWT must match {user_id} in URL path → otherwise 403 Forbidden
All database operations filter tasks by authenticated user_id — no possibility of data leakage
Clean, typed, and documented code using Pydantic models and SQLModel
Proper error handling (401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error)
FastAPI auto-generated OpenAPI docs (Swagger) work perfectly
Database connection uses provided Neon PostgreSQL URL via DATABASE_URL environment variable
JWT verification uses shared BETTER_AUTH_SECRET
All routes return consistent JSON responses with proper status codes

Constraints:

Code strictly in /backend/ folder only (main.py, routes/, models.py, db.py, dependencies.py)
Use FastAPI, SQLModel, pyjwt — no additional major libraries
Database connection string: your_database_url_here
PUT /api/{user_id}/tasks/{id} → Update task
DELETE /api/{user_id}/tasks/{id} → Delete task
PATCH /api/{user_id}/tasks/{id}/complete → Toggle completed status

Database Requirements:

tasks table with user_id (string, foreign key to users.id managed by Better Auth)
Proper indexes on user_id and completed
Timestamps: created_at, updated_at
Use SQLModel for models and sessions

Security (non-negotiable):

JWT verification middleware with shared secret
Extract sub (user_id) from token payload
Validate token signature, expiry, and user_id match
Never trust client-provided user_id without verification

Not building:

Frontend code
Authentication logic (handled by Better Auth in frontend)
User management endpoints (Better Auth handles signup/signin)
Advanced features (filtering by due date, tags, etc. — future phases)
Testing or deployment scripts (focus on core backend implementation)

Deliverables:

Fully functional, secure, and professional FastAPI backend ready to connect with the beautiful Next.js frontend
Backend that passes all security and isolation checks
Clean, readable, and maintainable code that feels production-grade"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Create New Task (Priority: P1)

As a user, I want to create a new task in my personal task list so that I can track my work and responsibilities. The system must securely authenticate me and ensure the task is associated with my user account only.

**Why this priority**: Creating tasks is the fundamental functionality of a todo app and enables the core user value proposition.

**Independent Test**: Can be fully tested by authenticating a user with a valid JWT token, sending a POST request to create a task, and verifying that the task is created in the database and associated with the correct user ID.

**Acceptance Scenarios**:

1. **Given** user has a valid JWT token, **When** user sends POST request to /api/{user_id}/tasks with valid task data, **Then** task is created in the database with correct user_id and returns 201 Created status
2. **Given** user has invalid or expired JWT token, **When** user sends POST request to /api/{user_id}/tasks, **Then** system returns 401 Unauthorized status and no task is created

---

### User Story 2 - View User's Tasks (Priority: P1)

As a user, I want to view all tasks that belong to me so that I can see my current responsibilities and progress. The system must only show tasks that belong to the authenticated user.

**Why this priority**: Viewing tasks is essential for users to interact with their data and forms the basis of the todo app experience.

**Independent Test**: Can be fully tested by authenticating a user with a valid JWT token, creating some tasks, and verifying that the user can only see their own tasks when accessing their task list.

**Acceptance Scenarios**:

1. **Given** user has valid JWT token and has created tasks, **When** user sends GET request to /api/{user_id}/tasks, **Then** system returns only tasks associated with that user_id with 200 OK status
2. **Given** user has valid JWT token but no tasks exist, **When** user sends GET request to /api/{user_id}/tasks, **Then** system returns empty list with 200 OK status

---

### User Story 3 - Update and Delete Tasks (Priority: P2)

As a user, I want to update and delete my tasks so that I can manage my work as it evolves. The system must ensure I can only modify tasks that belong to me.

**Why this priority**: Task management functionality allows users to maintain their task lists over time and is critical for long-term app utility.

**Independent Test**: Can be fully tested by authenticating a user with a valid JWT token, creating a task, and then performing update/delete operations on that task.

**Acceptance Scenarios**:

1. **Given** user has valid JWT token and owns a specific task, **When** user sends PUT request to /api/{user_id}/tasks/{task_id}, **Then** task is updated and returns 200 OK status
2. **Given** user has valid JWT token but attempts to modify another user's task, **When** user sends PUT request to /api/{user_id}/tasks/{task_id}, **Then** system returns 403 Forbidden status and task remains unchanged

---

### User Story 4 - Toggle Task Completion Status (Priority: P2)

As a user, I want to mark tasks as completed or incomplete so that I can track my progress and focus on pending items. The system must ensure I can only modify the completion status of my own tasks.

**Why this priority**: Completion tracking is a core feature of todo applications that enables users to manage their workflow effectively.

**Independent Test**: Can be fully tested by authenticating a user with a valid JWT token, creating a task, and toggling its completion status via the PATCH endpoint.

**Acceptance Scenarios**:

1. **Given** user has valid JWT token and owns a specific task, **When** user sends PATCH request to /api/{user_id}/tasks/{task_id}/complete, **Then** task completion status is toggled and returns 200 OK status

---

### Edge Cases

- What happens when a user attempts to access another user's task list? (System should return 403 Forbidden)
- How does the system handle JWT token expiration during requests? (System should return 401 Unauthorized)
- What happens when a user tries to access a non-existent task? (System should return 404 Not Found)
- How does the system handle malformed JWT tokens? (System should return 401 Unauthorized)
- What happens when database connection fails during operations? (System should return appropriate 5xx error)
- How does the system handle concurrent access to the same task? (System should maintain data integrity)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide secure REST API endpoints for task management operations (CRUD) with JWT token authentication
- **FR-002**: System MUST validate JWT tokens using the shared BETTER_AUTH_SECRET to authenticate users
- **FR-003**: Users MUST be able to create new tasks via POST /api/{user_id}/tasks with proper authentication
- **FR-004**: Users MUST be able to retrieve their own tasks via GET /api/{user_id}/tasks with proper authentication
- **FR-005**: Users MUST be able to retrieve a specific task via GET /api/{user_id}/tasks/{task_id} with proper authentication
- **FR-006**: Users MUST be able to update tasks via PUT /api/{user_id}/tasks/{task_id} with proper authentication
- **FR-007**: Users MUST be able to delete tasks via DELETE /api/{user_id}/tasks/{task_id} with proper authentication
- **FR-008**: Users MUST be able to toggle task completion status via PATCH /api/{user_id}/tasks/{task_id}/complete with proper authentication
- **FR-009**: System MUST enforce user ownership by validating that JWT token user_id matches the URL path user_id parameter
- **FR-010**: System MUST return appropriate HTTP status codes (200, 201, 401, 403, 404, 422) based on request outcome
- **FR-011**: System MUST filter database queries to return only tasks belonging to the authenticated user
- **FR-012**: System MUST support optional query parameters for task listing (status filtering, sorting)
- **FR-013**: System MUST provide consistent JSON responses across all endpoints
- **FR-014**: System MUST generate proper OpenAPI documentation accessible via standard FastAPI routes
- **FR-015**: System MUST store task data with proper timestamps (created_at, updated_at)

### Key Entities *(include if feature involves data)*

- **Task**: Represents a user's task with properties such as title, description, completion status, timestamps, and user association
- **User**: Represents a system user identified by user_id from JWT token, with ownership relationship to tasks

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create, read, update, and delete their tasks through the API with proper authentication
- **SC-002**: System enforces user isolation with 100% accuracy - users cannot access, modify, or view tasks belonging to other users
- **SC-003**: API endpoints respond with appropriate HTTP status codes (401 for unauthorized, 403 for forbidden, 404 for not found, etc.) consistently
- **SC-004**: JWT token validation works correctly with the shared BETTER_AUTH_SECRET, rejecting invalid or expired tokens
- **SC-005**: All API endpoints are properly documented in the auto-generated OpenAPI/Swagger documentation
- **SC-006**: Database operations complete successfully with proper error handling when database connectivity issues occur
- **SC-007**: Task data is stored with accurate timestamps and can be retrieved with full fidelity
- **SC-008**: System handles concurrent requests without data corruption or security vulnerabilities
- **SC-009**: API response times remain under 500ms for standard operations under normal load conditions
- **SC-010**: All endpoints properly validate input data and return appropriate error responses for invalid requests
