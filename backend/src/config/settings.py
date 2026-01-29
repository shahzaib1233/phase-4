"""Configuration settings for AI Todo Chatbot."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = ""

    # Cohere Configuration
    COHERE_API_KEY: str = ""
    COHERE_BASE_URL: str = "https://api.cohere.ai/compatibility/v1"
    COHERE_CHAT_MODEL: str = "command-r-08-2024"
    COHERE_TEMPERATURE: float = 0.3
    COHERE_MAX_TOKENS: int = 500

    # Better Auth
    BETTER_AUTH_SECRET: Optional[str] = None
    NEXT_PUBLIC_BETTER_AUTH_URL: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()