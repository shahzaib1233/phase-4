# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, PyJWT, Neon PostgreSQL driver
**Storage**: Neon Serverless PostgreSQL database
**Testing**: pytest (for future implementation)
**Target Platform**: Linux server (web backend)
**Project Type**: Web backend application
**Performance Goals**: <500ms response time for standard operations under normal load
**Constraints**: Must enforce user isolation, JWT token validation, secure data handling
**Scale/Scope**: Multi-user todo application with proper authentication and authorization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Spec-Driven Development**: ✅ Plan follows feature spec in /specs/002-backend/spec.md
2. **No Manual Coding**: ✅ Plan uses agents and skills exclusively for implementation
3. **User Isolation**: ✅ Plan enforces user isolation at API and database layers
4. **Stateless JWT Authentication**: ✅ Plan implements JWT-based authentication with Better Auth
5. **Technology Stack Compliance**: ✅ Plan uses FastAPI, SQLModel, Neon PostgreSQL as specified
6. **Architecture Decisions**: ✅ Plan follows RESTful API design with /api/{user_id}/tasks endpoints
7. **Security Rules**: ✅ Plan includes JWT validation and ownership enforcement

## Project Structure

### Documentation (this feature)

```text
specs/002-backend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── main.py              # FastAPI application entry point
├── models.py            # SQLModel task model
├── db.py                # Database connection and session
├── dependencies.py      # JWT verification middleware and dependencies
└── routes/
    └── tasks.py         # Task CRUD endpoint implementations
```

**Structure Decision**: Backend web application structure selected with separate modules for models, database, dependencies (auth), and routes. This follows FastAPI best practices and keeps the code organized for maintainability.

## Implementation Plan

1. **Phase name**: Backend Foundations & Environment Setup
   **Objective**: Set up the basic FastAPI project structure and configure environment variables for Neon PostgreSQL and Better Auth JWT
   **Tasks** (bullet list with file names to create/modify):
   - Create backend/ directory structure
   - Create requirements.txt with FastAPI, SQLModel, PyJWT, psycopg2-binary dependencies
   - Create .env file with DATABASE_URL and BETTER_AUTH_SECRET
   - Create main.py with basic FastAPI app setup
   **Assigned agent(s)**: Backend Implementer
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): None
   **Validation** (which agent checks this phase): Reviewer & Tester

2. **Phase name**: Neon PostgreSQL Database Connection & Session
   **Objective**: Implement database connection using SQLModel with Neon PostgreSQL and create session management
   **Tasks** (bullet list with file names to create/modify):
   - Create db.py with database connection and session setup
   - Implement get_session dependency for database sessions
   - Test database connection
   **Assigned agent(s)**: Database Architect
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): Phase 1
   **Validation** (which agent checks this phase): Reviewer & Tester

3. **Phase name**: JWT Verification Middleware & Dependencies
   **Objective**: Implement JWT token verification middleware using BETTER_AUTH_SECRET and create current_user dependency
   **Tasks** (bullet list with file names to create/modify):
   - Create dependencies.py with JWT verification functions
   - Implement get_current_user dependency that extracts user_id from JWT
   - Create proper error handling for invalid tokens
   **Assigned agent(s)**: Auth Specialist
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): Phase 2
   **Validation** (which agent checks this phase): Reviewer & Tester

4. **Phase name**: SQLModel Task Model & Schema
   **Objective**: Create the Task model using SQLModel with proper fields, relationships, and constraints
   **Tasks** (bullet list with file names to create/modify):
   - Create models.py with Task SQLModel
   - Implement user_id foreign key and proper indexes
   - Add created_at and updated_at timestamp fields
   - Create Pydantic schemas for request/response validation
   **Assigned agent(s)**: Database Architect
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): Phase 2
   **Validation** (which agent checks this phase): Reviewer & Tester

5. **Phase name**: Core Task CRUD Routes (Create, Read, Update, Delete)
   **Objective**: Implement the main CRUD endpoints for tasks with proper authentication and user ownership enforcement
   **Tasks** (bullet list with file names to create/modify):
   - Create routes/tasks.py with GET, POST, PUT, DELETE endpoints
   - Implement user_id validation against JWT token
   - Add database operations with proper filtering by user_id
   - Include request/response validation
   **Assigned agent(s)**: Backend Implementer
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): Phases 2, 3, 4
   **Validation** (which agent checks this phase): Reviewer & Tester

6. **Phase name**: Toggle Complete Endpoint
   **Objective**: Implement the PATCH endpoint to toggle task completion status
   **Tasks** (bullet list with file names to create/modify):
   - Add PATCH /api/{user_id}/tasks/{id}/complete endpoint in routes/tasks.py
   - Implement logic to toggle completion status
   - Ensure proper authentication and ownership validation
   **Assigned agent(s)**: Backend Implementer
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): Phase 5
   **Validation** (which agent checks this phase): Reviewer & Tester

7. **Phase name**: Query Params Support (status filter, sorting)
   **Objective**: Add support for query parameters to filter and sort tasks
   **Tasks** (bullet list with file names to create/modify):
   - Update GET /api/{user_id}/tasks endpoint with query parameters
   - Implement status filtering (completed/pending)
   - Add sorting options (by creation date, update date)
   **Assigned agent(s)**: Backend Implementer
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): Phase 5
   **Validation** (which agent checks this phase): Reviewer & Tester

8. **Phase name**: Error Handling & HTTP Exceptions
   **Objective**: Implement comprehensive error handling with appropriate HTTP status codes
   **Tasks** (bullet list with file names to create/modify):
   - Add custom exception handlers
   - Implement proper HTTP exception responses (401, 403, 404, 422)
   - Add validation for request data
   - Ensure consistent error response format
   **Assigned agent(s)**: Backend Implementer
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): Phases 3, 4, 5
   **Validation** (which agent checks this phase): Reviewer & Tester

9. **Phase name**: OpenAPI Documentation & Final Polish
   **Objective**: Ensure OpenAPI/Swagger documentation is complete and add final touches
   **Tasks** (bullet list with file names to create/modify):
   - Verify all endpoints are properly documented in OpenAPI
   - Add API title, description, and version
   - Add proper request/response examples
   - Add security schemes for JWT authentication
   **Assigned agent(s)**: Backend Implementer
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): All previous phases
   **Validation** (which agent checks this phase): Reviewer & Tester

10. **Phase name**: Full Backend Integration & Security Validation
   **Objective**: Perform comprehensive testing and validation of the complete backend
   **Tasks** (bullet list with file names to create/modify):
   - Run security validation checks
   - Test all endpoints with various scenarios
   - Validate user isolation and JWT enforcement
   - Perform integration testing with all components
   **Assigned agent(s)**: Full-Stack Integrator + Reviewer & Tester
   **Required skills** (from /skills/): None
   **Dependencies** (which previous phases must finish first): All previous phases
   **Validation** (which agent checks this phase): Full-Stack Integrator + Reviewer & Tester

Execute this plan in sequence to get a bulletproof backend ready for frontend connection.
