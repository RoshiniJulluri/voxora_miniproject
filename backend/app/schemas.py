from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterIn(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    is_active: bool
    onboarding_complete: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class AuthOut(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserOut


class PreferenceIn(BaseModel):
    preferred_language: str = Field(default='en', max_length=32)
    knowledge_level: str = Field(default='beginner', max_length=32)
    preferred_style: str = Field(default='conversational', max_length=32)
    preferred_voice: str | None = Field(default=None, max_length=80)
    category: str = Field(default='general', max_length=32)
    interests: list[str] = Field(default_factory=list, max_length=30)


class PreferenceOut(PreferenceIn):
    id: str

    model_config = ConfigDict(from_attributes=True)


class PodcastGenerateIn(BaseModel):
    topic: str = Field(min_length=2, max_length=240)
    category: str = Field(default='general', max_length=80)
    knowledge_level: str = Field(default='beginner', max_length=32)
    style: str = Field(default='conversational', max_length=32)
    language: str = Field(default='en', max_length=32)
    duration_minutes: int = Field(default=5, ge=1, le=180)
    voice: str | None = Field(default=None, max_length=80)
    additional_instructions: str = Field(default='', max_length=2000)


class PodcastOut(BaseModel):
    id: str
    title: str
    topic: str
    category: str
    description: str
    knowledge_level: str
    style: str
    language: str
    duration_requested: int
    duration_actual: int | None
    script: str
    transcript: str
    audio_url: str | None
    status: str
    error_message: str | None
    created_at: datetime
    takeaways: list[str]
    quiz: list[dict]


class QuizAnswerIn(BaseModel):
    question_id: str
    selected_answer: int = Field(ge=0, le=20)


class QuizSubmitIn(BaseModel):
    answers: list[QuizAnswerIn] = Field(min_length=1, max_length=30)
