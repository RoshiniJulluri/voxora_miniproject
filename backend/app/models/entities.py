import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


def now_utc():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = 'users'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    onboarding_complete: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    preference: Mapped['Preference | None'] = relationship(back_populates='user', uselist=False, cascade='all, delete-orphan')
    podcasts: Mapped[list['Podcast']] = relationship(back_populates='user', cascade='all, delete-orphan')


class Preference(Base):
    __tablename__ = 'user_preferences'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), unique=True)
    preferred_language: Mapped[str] = mapped_column(String(32), default='en')
    knowledge_level: Mapped[str] = mapped_column(String(32), default='beginner')
    preferred_style: Mapped[str] = mapped_column(String(32), default='conversational')
    preferred_voice: Mapped[str | None] = mapped_column(String(80), nullable=True)
    interests: Mapped[list] = mapped_column(JSON, default=list)
    category: Mapped[str] = mapped_column(String(32), default='general')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    user: Mapped[User] = relationship(back_populates='preference')


class Podcast(Base):
    __tablename__ = 'podcasts'
    __table_args__ = (Index('ix_podcasts_user_created', 'user_id', 'created_at'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'))
    title: Mapped[str] = mapped_column(String(240), default='Podcast in progress')
    topic: Mapped[str] = mapped_column(String(240))
    category: Mapped[str] = mapped_column(String(80), default='general')
    description: Mapped[str] = mapped_column(Text, default='')
    knowledge_level: Mapped[str] = mapped_column(String(32))
    style: Mapped[str] = mapped_column(String(32))
    language: Mapped[str] = mapped_column(String(32))
    duration_requested: Mapped[int] = mapped_column(Integer)
    voice: Mapped[str | None] = mapped_column(String(80), nullable=True)
    additional_instructions: Mapped[str] = mapped_column(Text, default='')
    duration_actual: Mapped[int | None] = mapped_column(Integer, nullable=True)
    script: Mapped[str] = mapped_column(Text, default='')
    transcript: Mapped[str] = mapped_column(Text, default='')
    audio_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    audio_storage_key: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default='queued', index=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    user: Mapped[User] = relationship(back_populates='podcasts')
    takeaways: Mapped[list['PodcastTakeaway']] = relationship(cascade='all, delete-orphan', order_by='PodcastTakeaway.display_order')
    questions: Mapped[list['QuizQuestion']] = relationship(cascade='all, delete-orphan', order_by='QuizQuestion.display_order')


class PodcastTakeaway(Base):
    __tablename__ = 'podcast_takeaways'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    podcast_id: Mapped[str] = mapped_column(ForeignKey('podcasts.id', ondelete='CASCADE'), index=True)
    takeaway_text: Mapped[str] = mapped_column(Text)
    display_order: Mapped[int] = mapped_column(Integer)


class QuizQuestion(Base):
    __tablename__ = 'quiz_questions'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    podcast_id: Mapped[str] = mapped_column(ForeignKey('podcasts.id', ondelete='CASCADE'), index=True)
    question: Mapped[str] = mapped_column(Text)
    options: Mapped[list] = mapped_column(JSON)
    correct_answer: Mapped[int] = mapped_column(Integer)
    explanation: Mapped[str] = mapped_column(Text, default='')
    display_order: Mapped[int] = mapped_column(Integer)


class QuizAttempt(Base):
    __tablename__ = 'quiz_attempts'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), index=True)
    podcast_id: Mapped[str] = mapped_column(ForeignKey('podcasts.id', ondelete='CASCADE'), index=True)
    score: Mapped[int] = mapped_column(Integer)
    total_questions: Mapped[int] = mapped_column(Integer)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    answers: Mapped[list['QuizAnswer']] = relationship(cascade='all, delete-orphan')


class QuizAnswer(Base):
    __tablename__ = 'quiz_answers'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    attempt_id: Mapped[str] = mapped_column(ForeignKey('quiz_attempts.id', ondelete='CASCADE'))
    question_id: Mapped[str] = mapped_column(ForeignKey('quiz_questions.id', ondelete='CASCADE'))
    selected_answer: Mapped[int] = mapped_column(Integer)
    is_correct: Mapped[bool] = mapped_column(Boolean)
