---
id: 1
title: AI Todo Chatbot Spec
stage: spec
date_iso: 2026-01-17
surface: agent
model: Claude Sonnet 4.5
feature: ai-todo-chatbot
branch: 1-ai-todo-chatbot
user: user
command: /sp.specify
labels: ["specification", "chatbot", "todo", "cohere"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - specs/1-ai-todo-chatbot/spec.md
  - specs/1-ai-todo-chatbot/checklists/requirements.md
tests_yaml: []
---

# PHR: AI Todo Chatbot Spec

## Prompt Text

```
Phase III: AI-Powered Todo Chatbot with Cohere Integration

Target audience: End-users wanting natural language Todo management via chat, and hackathon judges evaluating agentic AI, tool calling, stateless design, and cost-effective LLM usage.

Focus: Build conversational AI Todo chatbot on top of Phase II monorepo using Cohere API (free tier) for LLM + tool calling, OpenAI Agents SDK (via Cohere Compatibility API) for agent orchestration, Official MCP Python SDK to expose task tools, FastAPI chat endpoint, and Neon PostgreSQL for stateless conversation persistence. Reuse Phase II JWT auth and task tables.

Success criteria:
- Chat endpoint POST /api/{user_id}/chat accepts message + optional conversation_id → returns AI response + tool_calls
- Agent uses OpenAI Agents SDK Runner + Cohere Compatibility API (base_url: https://api.cohere.ai/compatibility/v1, api_key: YOUR_COHERE_API_KEY_HERE)
- Cohere model (recommend command-r-plus or command-a) calls MCP tools when needed (add_task, list_tasks) and confirms actions naturally
- Handles errors friendly (task not found, etc.)
- Security: JWT verifies user_id; tool calls validate against authenticated user
- Frontend ready for ChatKit integration

Constraints:
- Use Cohere via OpenAI-compatible endpoint in Agents SDK (AsyncOpenAI client with custom base_url/api_key)
- Neon DB: DATABASE_URL = YOUR_DATABASE_URL_HERE
- New tables: conversations (user_id, id, created_at, updated_at), messages (user_id, id, conversation_id, role, content, created_at)
- Changes in /backend/ (chat endpoint, MCP tools, conversation models, Cohere config)
- Reuse Better Auth JWT
- Follow CLAUDE.md files
- Reference/update @specs/features/chatbot.md, add @specs/api/chat-endpoint.md, @specs/mcp-tools.md
- No manual coding — use agents/skills

Not building:
- Voice, multi-language (yet), Phase V features
- Direct Cohere client (use OpenAI-compatible for and remember we will use cohera as an ai agent like we use open ai api key we will not use open ai api key we will use cohera so do work accordingly and my cohera api key YOUR_COHERE_API_KEY_HERE and my neon db url is DATABASE_URL=YOUR_DATABASE_URL_HERE and neon db url alrady exist in the directory you can see and that is workign properly # Cohere Settings
COHERE_CHAT_MODEL=command-r-08-2024
COHERE_TEMPERATURE=0.3
COHERE_MAX_TOKENS=500 these are the seettings you ahve to use now wriet specification for htis
```

## Response Text

Created a comprehensive specification for the AI-Powered Todo Chatbot with Cohere Integration feature. The specification includes:

- User scenarios covering natural language todo management, conversation persistence, and secure authentication
- Functional requirements focusing on user value without implementation details
- Key entities representing conversations, messages, users, and tasks
- Technology-agnostic success criteria with measurable outcomes
- A quality checklist validating the specification completeness

The specification removes implementation-specific details (like specific API names, endpoints, and technical configurations) to focus on user value and business needs, while maintaining all the essential functionality requirements.

## Outcome

Specification created successfully at specs/1-ai-todo-chatbot/spec.md with accompanying checklist at specs/1-ai-todo-chatbot/checklists/requirements.md. Ready for the next phase of planning.