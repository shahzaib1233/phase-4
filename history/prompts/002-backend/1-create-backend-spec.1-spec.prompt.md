---
id: 1
title: Create Backend Spec
stage: spec
date: 2026-01-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-backend
branch: 002-backend
user: Claude Code
command: "/sp.specify"
labels: [spec, backend, api]
links:
  spec: specs/002-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-backend/spec.md
 - specs/002-backend/checklists/requirements.md
tests:
 - null
---

## Prompt

```text
Secure & Production-Ready Backend for Phase II Todo Web App
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
Database connection string: postgresql://neondb_owner:npg_o9OLfwn0mCNT@ep-late-sun-adcwxiyv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=req single task
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
Clean, readable, and maintainable code that feels production-grade
```

## Response snapshot

Created comprehensive feature specification for the secure and production-ready backend for Phase II Todo Web App. The specification includes:

1. User Scenarios & Testing section with 4 prioritized user stories (P1-P2) covering:
   - Creating new tasks
   - Viewing user's tasks
   - Updating and deleting tasks
   - Toggling task completion status
   - Edge cases for security and error handling

2. Requirements section with 15 functional requirements (FR-001 to FR-015) covering:
   - Secure REST API endpoints with JWT authentication
   - User ownership enforcement
   - Proper HTTP status codes
   - Data filtering and validation
   - OpenAPI documentation

3. Success Criteria section with 10 measurable outcomes (SC-001 to SC-010) covering:
   - User isolation accuracy
   - Authentication validation
   - API response consistency
   - Performance metrics

4. Quality checklist to validate specification completeness

## Outcome

- ✅ Impact: Complete feature specification created for backend implementation
- 🧪 Tests: null
- 📁 Files: Created spec.md and requirements checklist
- 🔁 Next prompts: Ready for planning phase with /sp.plan
- 🧠 Reflection: Specification addresses all security and isolation requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All specification sections completed
- Prompt variant (if applicable): Standard specification creation
- Next experiment (smallest change to try): Proceed to planning phase