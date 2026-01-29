"""Database migration scripts for conversation tables."""

from sqlmodel import SQLModel, create_engine
from .models.conversation import Conversation, Message
from .config.settings import settings
import os

def create_tables():
    """Create all database tables."""
    # Use the DATABASE_URL from settings
    engine = create_engine(settings.DATABASE_URL)

    # Create all tables
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()