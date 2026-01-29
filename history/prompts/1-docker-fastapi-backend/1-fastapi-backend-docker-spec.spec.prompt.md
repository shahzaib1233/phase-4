---
id: 1
title: "fastapi-backend-docker-spec"
stage: "spec"
date_iso: "2026-01-28"
surface: "agent"
model: "Claude Sonnet 4.5"
feature: "docker-fastapi-backend"
branch: "1-docker-fastapi-backend"
user: "user"
command: "/sp.specify Phase IV: Local Kubernetes Deployment on Minikube"
labels: ["docker", "fastapi", "kubernetes", "specification"]
spec: "specs/1-docker-fastapi-backend/spec.md"
ticket: null
adr: null
pr: null
files_yaml:
  - "specs/1-docker-fastapi-backend/spec.md"
  - "specs/1-docker-fastapi-backend/checklists/requirements.md"
tests_yaml: []
---

# PHR: FastAPI Backend Docker Specification

## Prompt Text

```
Phase IV: Local Kubernetes Deployment on Minikube

Strictly follow my existing constitution (already in specs/phase-iv/constitution.md or .specify/memory/constitution.md) as the absolute authority: all decisions must align with it, including clean code, security, spec-driven only (no manual code), Phase IV goals (Docker containerization for Next.js frontend + FastAPI backend, Helm charts later, kubectl-ai/kagent support, Neon DB connection, OpenAI chatbot via natural language, reusable intelligence where possible).

Generate a new specification for the first containerization artifact.

Component: FastAPI Backend Dockerfile

Detailed spec requirements:
- Production-ready multi-stage Dockerfile for the FastAPI backend from Phase II/III.
- Base images: python:3.13-slim (builder and final).
- Working directory: /app
- Dependency management: Use uv (uv sync --frozen --no-install-project for caching).
- Copy order for caching: pyproject.toml + uv.lock (or requirements.txt) first, then source code (src/ or app/).
- Builder stage: Install uv if needed, uv sync, copy venv.
- Final stage: Copy only runtime venv + code, no dev tools, minimal size (<300MB ideal).
- Expose port 8000.
- Runtime command: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2 --reload=false (production mode).
- Environment variables support: Load from Kubernetes Secrets later (e.g., NEON_DATABASE_URL, OPENAI_API_KEY, BETTER_AUTH_SECRET) — do not hardcode.
- Health check: Optional /health endpoint if exists in app.
- Labels: Add standard ones (e.g., maintainer, version).
- Security: No root user, use non-root if possible.
- Follow hackathon constraints: Integrate with OpenAI Agents SDK / ChatKit / MCP SDK for todo management via natural language.
- Bonus potential: Design for reusability (e.g., comments on how to parameterize for other FastAPI apps).

Create a full markdown spec file content (as if writing specs/phase-iv/spec-docker-backend.md), including:
- Title and phase reference
- Objective
- Acceptance criteria
- Constraints from constit
```

## Response Text

Created a comprehensive specification for the FastAPI Backend Dockerfile in the context of Phase IV: Local Kubernetes Deployment on Minikube. The specification includes:

- User scenarios and testing requirements with prioritized user stories
- Functional requirements covering multi-stage builds, dependency management with uv, security considerations, and Kubernetes integration
- Success criteria with measurable outcomes
- A quality checklist to validate the specification

The specification addresses all the detailed requirements provided, including multi-stage Dockerfile structure, base images, dependency management, security considerations, and environment variable support for Kubernetes Secrets.

## Outcome

Successfully generated a complete specification for the FastAPI Backend Dockerfile that follows the Spec-Driven Development approach. The specification is ready for the planning phase and includes all necessary details for implementation.