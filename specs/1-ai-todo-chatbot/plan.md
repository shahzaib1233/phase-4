# Implementation Plan: AI-Powered Todo Chatbot with Cohere Integration

**Branch**: `1-ai-todo-chatbot` | **Date**: 2026-01-17 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/[1-ai-todo-chatbot]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a conversational AI Todo chatbot that enables natural language task management using Cohere AI service for LLM and tool calling, with stateless conversation persistence in Neon PostgreSQL database. The system will integrate with existing Phase II JWT authentication and task management infrastructure while providing a natural language interface for todo operations.

## Technical Context

**Language/Version**: Python 3.11, TypeScript/JavaScript for frontend integration
**Primary Dependencies**: FastAPI, SQLModel, Better Auth, Cohere API, OpenAI Agents SDK (compatible), MCP Python SDK
**Storage**: Neon Serverless PostgreSQL (DATABASE_URL='postgresql://neondb_owner:npg_XwKLDv1o3CyM@ep-cool-cherry-abr7d232-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
**Testing**: pytest for backend, Jest for frontend
**Target Platform**: Linux server (web application backend)
**Project Type**: Web - extending existing backend with new chat endpoint and conversation management
**Performance Goals**: <3 second response times for 95% of chat requests, 90% accuracy in natural language understanding
**Constraints**: Stateless design (load full conversation history from DB on every request), JWT authentication required for all endpoints, user isolation enforced at all layers
**Scale/Scope**: Individual user conversations, leveraging existing multi-user infrastructure from Phase II

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Development Only**: ✓ Will strictly follow specifications in /specs/
- **No Manual Coding**: ✓ All code will be generated exclusively by Claude Code using agents and skills
- **User Isolation is Sacred**: ✓ Every user will only access their own conversations and tasks, enforced at API and database layers
- **Stateless JWT Authentication**: ✓ Will use existing Better Auth with JWT tokens, no session storage
- **Single Source of Truth**: ✓ Will follow requirements from spec.md and constitution.md

## Project Structure

### Documentation (this feature)

```text
specs/1-ai-todo-chatbot/
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
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── conversation.py      # New: Conversation and Message models
│   │   └── task.py              # Existing: From Phase II
│   ├── services/
│   │   ├── __init__.py
│   │   ├── chat_service.py      # New: Cohere integration and conversation handling
│   │   ├── auth_service.py      # Existing: From Phase II
│   │   └── task_service.py      # Existing: From Phase II
│   ├── api/
│   │   ├── __init__.py
│   │   ├── chat_router.py       # New: Chat endpoint
│   │   └── task_router.py       # Existing: From Phase II
│   ├── tools/
│   │   ├── __init__.py
│   │   └── mcp_tools.py         # New: MCP tools for task management
│   └── config/
│       ├── __init__.py
│       └── settings.py          # New: Cohere configuration
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

frontend/                    # Existing from Phase II
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: Extending the existing web application structure with new chat endpoint and conversation management functionality while reusing existing authentication and task management infrastructure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Phase 0: Research

Research will focus on resolving technical unknowns related to Cohere API integration via OpenAI-compatible endpoint, MCP tool definition and server setup, and stateless conversation handling patterns.

### Research Areas:
- Cohere compatibility with OpenAI Agents SDK
- MCP Python SDK tool definition patterns
- Conversation history loading and context management
- Best practices for stateless chat implementations
- JWT token validation in chat endpoints

## Phase 1: Design & Architecture

Design phase will establish data models for conversations and messages, define API contracts for the chat endpoint, and specify the MCP tools for task management operations.

### Deliverables:
- Data model definitions for Conversation and Message entities
- API contract for chat endpoint
- MCP tool specifications for task operations
- Quickstart guide for developers
- Agent context updates for new technologies