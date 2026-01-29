from sqlmodel import create_engine, Session
from typing import Generator
from .src.config.settings import settings

# Use database URL from settings (loaded from .env)
DATABASE_URL = settings.DATABASE_URL

# Create the database engine
engine = create_engine(DATABASE_URL, echo=True)

def get_session() -> Generator[Session, None, None]:
    """
    Dependency to get a database session
    """
    with Session(engine) as session:
        yield session