import os

os.environ['DATABASE_URL'] = 'sqlite:///./test_voxora.sqlite'
os.environ['SECRET_KEY'] = 'test-only-secret-key-that-is-long-enough-for-tests'
os.environ['FRONTEND_ORIGIN'] = 'http://testserver'

import pytest

from app.database.base import Base
from app.database.connection import SessionLocal, engine
from app import models  # noqa: F401


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


