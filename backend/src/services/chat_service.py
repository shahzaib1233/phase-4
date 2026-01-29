"""Chat service for AI Todo Chatbot with Cohere integration."""

import asyncio
from typing import Dict, Any, List, Optional
from sqlmodel import Session, select
from openai import AsyncOpenAI
from ..models.conversation import Conversation, Message, ChatRequest, ChatResponse, RoleType
from ..tools.mcp_tools import get_available_tools, execute_tool_call
from ..config.settings import settings
from datetime import datetime


class ChatService:
    def __init__(self, session: Session):
        self.session = session
        # Initialize Cohere-compatible client
        self.client = AsyncOpenAI(
            base_url=settings.COHERE_BASE_URL,
            api_key=settings.COHERE_API_KEY
        )

    async def process_chat(self, user_id: str, chat_request: ChatRequest) -> ChatResponse:
        """
        Process a chat request and return AI response with potential tool calls.

        Args:
            user_id: The ID of the authenticated user
            chat_request: The chat request containing message and optional conversation_id

        Returns:
            ChatResponse with AI response and tool calls
        """
        # Get or create conversation
        if chat_request.conversation_id:
            conversation = self.session.get(Conversation, chat_request.conversation_id)
            if not conversation:
                # If conversation doesn't exist, create a new one
                conversation = Conversation(user_id=user_id)
                self.session.add(conversation)
                self.session.commit()
                self.session.refresh(conversation)
        else:
            # Create new conversation
            conversation = Conversation(user_id=user_id)
            self.session.add(conversation)
            self.session.commit()
            self.session.refresh(conversation)

        # Add user message to conversation
        user_message = Message(
            conversation_id=conversation.id,
            user_id=user_id,
            role=RoleType.user.value,
            content=chat_request.message
        )
        self.session.add(user_message)
        self.session.commit()

        # Load conversation history for context
        conversation_history = await self._get_conversation_history(conversation.id)

        # Prepare messages for Cohere
        messages = []
        for msg in conversation_history:
            # Only add messages with non-empty content
            if msg.content and msg.content.strip():
                # Ensure role is properly formatted for Cohere
                role = "assistant" if msg.role.lower() in ["assistant", "ai", "bot"] else "user"
                messages.append({
                    "role": role,
                    "content": msg.content
                })

        # Add current user message
        messages.append({
            "role": "user",
            "content": chat_request.message or "Hello"
        })

        try:
            # Call Cohere with tools (single call to avoid complex tool response handling)
            response = await self._call_cohere_with_tools(messages)

            # Extract response content and tool calls
            response_content = ""
            all_tool_calls = []

            if hasattr(response.choices[0].message, 'content'):
                response_content = response.choices[0].message.content or ""

            if hasattr(response.choices[0].message, 'tool_calls') and response.choices[0].message.tool_calls:
                import json
                for tool_call in response.choices[0].message.tool_calls:
                    try:
                        arguments = json.loads(tool_call.function.arguments)
                    except json.JSONDecodeError:
                        arguments = {}

                    # Handle both possible formats depending on the API
                    if hasattr(tool_call.function, 'name'):
                        tool_name = tool_call.function.name
                    else:
                        # Fallback if name is in a different location
                        tool_name = getattr(tool_call, 'name', None) or getattr(tool_call.function, 'name', '')

                    # Store the original tool call ID
                    original_tool_call_id = getattr(tool_call, 'id', f"call_{tool_name}_{len(all_tool_calls)}")

                    tool_call_obj = {
                        "id": original_tool_call_id,
                        "name": tool_name,
                        "arguments": arguments
                    }

                    # Execute the tool call immediately
                    # Inject user_id into the arguments if it's missing
                    exec_arguments = arguments.copy()
                    if "user_id" not in exec_arguments or not exec_arguments["user_id"]:
                        exec_arguments["user_id"] = user_id

                    result = execute_tool_call(
                        tool_name=tool_call_obj["name"],
                        arguments=exec_arguments,
                        session=self.session
                    )

                    # Add result to the tool call object
                    tool_call_obj["result"] = result
                    all_tool_calls.append(tool_call_obj)

                    # Special handling for bulk operations
                    # If the AI called list_tasks with intent to delete all, automatically delete all tasks
                    if (tool_call_obj["name"] == "list_tasks" and
                        "delete" in chat_request.message.lower() and
                        ("all" in chat_request.message.lower() or "eall" in chat_request.message.lower())):

                        # Extract task IDs from the result and delete them
                        if result.get("success") and "tasks" in result:
                            deleted_count = 0
                            for task in result["tasks"]:
                                delete_arguments = {
                                    "task_id": task["id"],
                                    "user_id": user_id
                                }

                                delete_result = execute_tool_call(
                                    tool_name="delete_task",
                                    arguments=delete_arguments,
                                    session=self.session
                                )

                                # Count successful deletions
                                if delete_result.get("success"):
                                    deleted_count += 1

                                # Create a virtual tool call object for the deletion
                                delete_tool_call_obj = {
                                    "id": f"delete_task_{task['id']}",
                                    "name": "delete_task",
                                    "arguments": delete_arguments,
                                    "result": delete_result
                                }
                                all_tool_calls.append(delete_tool_call_obj)

                            # Update the response content to acknowledge the operation
                            response_content = f"I've successfully deleted {deleted_count} tasks for you."

            # Create assistant message
            assistant_message = Message(
                conversation_id=conversation.id,
                user_id=user_id,  # Associate with the actual user
                role=RoleType.assistant.value,
                content=response_content
            )
            self.session.add(assistant_message)
            self.session.commit()

            # Update conversation timestamp
            conversation.updated_at = datetime.utcnow()
            self.session.add(conversation)
            self.session.commit()

            return ChatResponse(
                response=response_content,
                conversation_id=conversation.id,
                tool_calls=all_tool_calls
            )

        except Exception as e:
            # Log error and return error response
            print(f"Error processing chat: {str(e)}")

            # Create error response message
            error_message = f"I'm sorry, I encountered an error processing your request: {str(e)}"
            assistant_message = Message(
                conversation_id=conversation.id,
                user_id=user_id,  # Associate with the actual user
                role=RoleType.assistant.value,
                content=error_message
            )
            self.session.add(assistant_message)
            self.session.commit()

            return ChatResponse(
                response=error_message,
                conversation_id=conversation.id,
                tool_calls=[]
            )

    async def _get_conversation_history(self, conversation_id: str) -> List[Message]:
        """Get conversation history for context."""
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at)

        messages = self.session.exec(statement).all()
        return messages

    async def _call_cohere_with_tools(self, messages: List[Dict[str, str]]) -> Any:
        """Call Cohere API with tools for natural language processing."""
        try:
            # Get available tools
            tools = get_available_tools(self.session)

            # Make API call to Cohere-compatible endpoint
            response = await self.client.chat.completions.create(
                model=settings.COHERE_CHAT_MODEL,
                messages=messages,
                tools=tools,
                tool_choice="auto",  # Let the model decide when to use tools
                max_tokens=settings.COHERE_MAX_TOKENS,
                temperature=settings.COHERE_TEMPERATURE
            )

            return response
        except Exception as e:
            print(f"Cohere API error: {str(e)}")
            raise e


# Helper function to create chat service
def create_chat_service(session: Session) -> ChatService:
    """Create a chat service instance."""
    return ChatService(session)