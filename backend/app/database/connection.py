from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

connect_args = {'check_same_thread': False} if settings.database_url.startswith('sqlite') else {}
engine_options = {'poolclass': StaticPool} if settings.database_url in ('sqlite://', 'sqlite:///:memory:') else {}
engine = create_engine(settings.database_url, pool_pre_ping=True, connect_args=connect_args, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
