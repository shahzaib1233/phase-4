---
id: 1
title: AI Todo Chatbot Planning
stage: plan
date_iso: 2026-01-17
surface: agent
model: Claude Sonnet 4.5
feature: ai-todo-chatbot
branch: 1-ai-todo-chatbot
user: user
command: /sp.plan
labels: ["planning", "chatbot", "cohere", "database"]
links:
  spec: ../spec.md
  ticket: null
  adr: null
  pr: null
files_yaml:
  - specs/1-ai-todo-chatbot/plan.md
  - specs/1-ai-todo-chatbot/research.md
  - specs/1-ai-todo-chatbot/data-model.md
  - specs/1-ai-todo-chatbot/contracts/chat-api.yaml
  - specs/1-ai-todo-chatbot/quickstart.md
tests_yaml: []
---

# PHR: AI Todo Chatbot Planning

## Prompt Text

```
AI-Powered Todo Chatbot with Cohere Integration – Phase III

Target: Execute the specified "Phase III: AI-Powered Todo Chatbot with Cohere Integration" with perfect integration of Cohere API (free tier) via OpenAI-compatible endpoint, OpenAI Agents SDK (routed to Cohere), MCP tools, stateless chat endpoint, Neon DB persistence, and natural language task management.

Success criteria for this plan:
- A clear, sequential, numbered roadmap that guarantees a working, cost-effective AI chatbot
- Every task assigns the correct agent from /agents/
- Identifies and sequences required skills from /skills/ (add new ones if needed, e.g., cohere-compatibility-setup.md, mcp-tool-definition.md)
- Full coverage of: Cohere config, MCP 5 tools, chat endpoint, conversation DB tables/logic, agent runner with tool calling, JWT security, error handling, confirmation messages
- Stateless design: Load full conversation history from Neon DB on every request
- Reuse Phase II: JWT auth, task tables, Neon DB connection
- Natural language examples work: "Add task buy groceries", "Show pending tasks", "Complete task 3", "Delete the old meeting"
- Uses Cohere key: YOUR_COHERE_API_KEY_HERE
- Cohere model: command-r-plus or command-a (strong tool use)
- No OpenAI costs — all LLM calls go to Cohere Compatibility API

Planning guidelines:
- Strictly follow Project Constitution, Phase III spec, and Cohere compatibility rules
- Use OpenAI Agents SDK with custom AsyncOpenAI client: base_url="https://api.cohere.ai/compatibility/v1", api_key=your_cohere_key
- Break into logical phases with clear dependencies
- Neon DATABASE_URL updated to: postgresql://neondb_owner:npg_XwKLDv1o3CyM@ep-cool-cherry-abr7d232-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
- Add new models: Conversation, Message (SQLModel)
- Prioritize: JWT verification → user_id validation in tools → stateless DB flow → tool calling loop
- Each phase ends with validation (Full-Stack Integrator + Reviewer & Tester)

Deliverables of this plan:
Numbered markdown phases with exact structure:
1. Phase name
2. Objective (one sentence)
3. Tasks (bullet list with files to create/modify)
4. Assigned agent(s)
5. Required / suggested skills (reference /skills/ filenames)
6. Dependencies (previous phase numbers)
7. Validation (which agent reviews)

Phases to include (in this exact order):
1. Database Schema Extension for Conversations & Messages
2. Cohere Compatibility Setup in Agents SDK
3. MCP Tools Definition & Server (5 tools: add, list
```

## Response Text

Successfully completed the implementation planning for the AI-Powered Todo Chatbot with Cohere Integration. The following artifacts were created:

1. **Implementation Plan** (`specs/1-ai-todo-chatbot/plan.md`): Comprehensive plan outlining the technical approach, project structure, and phases for implementation.

2. **Research Document** (`specs/1-ai-todo-chatbot/research.md`): Detailed research on Cohere API integration, MCP tool patterns, conversation management, and authentication integration.

3. **Data Model** (`specs/1-ai-todo-chatbot/data-model.md`): Complete data model definitions for Conversation and Message entities, including relationships, validation rules, and SQLModel examples.

4. **API Contract** (`specs/1-ai-todo-chatbot/contracts/chat-api.yaml`): OpenAPI specification for the chat endpoint with proper authentication and error handling.

5. **Quickstart Guide** (`specs/1-ai-todo-chatbot/quickstart.md`): Step-by-step instructions for setting up and running the chatbot integration.

The plan adheres to the project constitution, maintains user isolation, leverages existing Phase II infrastructure, and implements a stateless design for scalability. All technical unknowns have been resolved and implementation can proceed with confidence.

## Outcome

The implementation plan is complete with all required documentation. The next step would be to generate the tasks using `/sp.tasks` to begin implementation. The plan covers all requirements from the original specification including Cohere integration, MCP tools, stateless chat endpoint, Neon DB persistence, and natural language task management.