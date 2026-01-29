#!/usr/bin/env python3
"""
Database initialization script for the Todo API.
Creates all necessary tables in the database.
"""

import sys
import os

# Add the backend directory to the path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from sqlmodel import SQLModel, create_engine
from backend.src.config.settings import settings
from backend.src.models.conversation import Conversation, Message
from backend.models import User, Task  # Import existing models too

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")

    # Create database engine with the URL from settings
    engine = create_engine(settings.DATABASE_URL, echo=True)

    # Create all tables
    SQLModel.metadata.create_all(engine)

    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()