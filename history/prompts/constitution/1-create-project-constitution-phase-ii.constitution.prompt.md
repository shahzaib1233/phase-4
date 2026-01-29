---
id: 1
title: "Create Project Constitution Phase II"
stage: constitution
date: 2026-01-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: master
user: user
command: sp.constitution
labels: ["constitution", "governance", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests: []
---

# Create Project Constitution Phase II

## Prompt Text
```
Name: Project Constitution for Phase II - Full-Stack Todo Web App

Instructions:
You are generating the official **Project Constitution** for the Hackathon Todo App – Phase II (Full-Stack Web Application). This constitution is a permanent, high-level governing document that defines the unbreakable rules, principles, architecture decisions, and boundaries for the entire Phase II development.

Create a new file at the root of the monorepo: **CONSTITUTION.md**

The constitution must be written in clear, authoritative markdown with the following exact structure and sections. Do not add extra sections unless explicitly justified.

# Project Constitution – Phase II: Full-Stack Todo Web Application

## 1. Project Purpose
A secure, multi-user Todo web application built with modern full-stack technologies, evolving from a console app into a production-ready web app with user authentication and persistent storage.

Current phase: Phase II – Transform into a full-stack web application with authentication.

## 2. Core Principles (Non-Negotiable)
- **Spec-Driven Development Only**: All features, changes, and implementations MUST start from and strictly follow specifications in /specs/. No feature is implemented without an updated spec.
- **No Manual Coding**: All code is generated exclusively by Claude Code using agents and skills. Manual edits are forbidden during the hackathon.
- **User Isolation is Sacred**: Every user must only ever see, modify, or delete their own tasks. This is enforced at every layer (API routes, database queries, frontend calls).
- **Stateless JWT Authentication**: Authentication uses Better Auth with JWT tokens only. No session storage, no cookies for auth persistence beyond token expiry.
- **Single Source of Truth**: The /specs/ folder and this CONSTITUTION.md are the only sources of truth for requirements and architecture.

## 3. Technology Stack (Locked)
| Layer          | Technology                          | Version/Notes                     |
|----------------|-------------------------------------|-----------------------------------|
| Frontend       | Next.js                             | 16+ (App Router)                  |
| Styling        | Tailwind CSS                        | Only classes, no inline styles    |
| Backend        | Python FastAPI                      | Latest stable                     |
| ORM            | SQLModel                            | Pydantic + SQLAlchemy             |
| Database       | Neon Serverless PostgreSQL          | Managed via DATABASE_URL          |
| Authentication | Better Auth (with JWT plugin)       | Shared BETTER_AUTH_SECRET         |
| Development    | Spec-Kit Plus + Claude Code agents  | /agents/ and /skills/ libraries   |

No additional frameworks, libraries, or tools may be introduced without amending this constitution.

## 4. Architecture Decisions
- **Monorepo Structure**: Single repository with clear separation: /frontend, /backend, /specs, /agents, /skills
- **API Design**: RESTful endpoints under /api/{user_id}/tasks with JWT required on every request
- **Authentication Flow**:
  - Better Auth issues JWT on sign-up/sign-in
  - Frontend attaches JWT in Authorization: Bearer header for every API call
  - FastAPI backend verifies JWT using shared BETTER_AUTH_SECRET
  - Backend extracts user_id from token and enforces match with URL path parameter
- **Database**:
  - tasks table has mandatory user_id foreign key
  - All queries filter by user_id
  - Indexes on user_id and completed fields
- **Development Workflow**:
  1. Update or create spec
  2. Invoke Planner agent
  3. Use appropriate agents (Backend Implementer, Frontend Implementer, etc.)
  4. Apply relevant skills
  5. Validate with Full-Stack Integrator and Reviewer & Tester agents

## 5. Security Rules
- All API endpoints require valid JWT → 401 Unauthorized if missing/invalid
- Ownership enforcement → 403 Forbidden if user_id mismatch
- Environment variables only for secrets (BETTER_AUTH_SECRET, DATABASE_URL)
- Never log tokens or sensitive data

## 6. Quality & Conventions
```

## Response Text
Created the complete Project Constitution file (.specify/memory/constitution.md) with all required sections including Project Purpose, Core Principles, Technology Stack, Architecture Decisions, Security Rules, and Quality & Conventions. The constitution serves as the governing document for the Todo Web Application Phase II project with specific rules for spec-driven development, technology stack, user isolation, authentication, and development workflow.