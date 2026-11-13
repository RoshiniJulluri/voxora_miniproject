from functools import lru_cache
import secrets

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    # A local SQLite database keeps the out-of-the-box development setup usable
    # without requiring a separately installed PostgreSQL server. Deployments can
    # continue to provide DATABASE_URL to use PostgreSQL.
    database_url: str = 'sqlite:///./voxora.db'
    secret_key: str = secrets.token_urlsafe(48)
    access_token_expire_minutes: int = 60
    gemini_api_key: str | None = None
    gemini_model: str = 'gemini-2.5-flash'
    murf_api_key: str | None = None
    frontend_origin: str = 'http://localhost:5173'
    audio_storage_mode: str = 'local'
    audio_storage_path: str = './storage/audio'
    r2_endpoint_url: str | None = None
    r2_access_key_id: str | None = None
    r2_secret_access_key: str | None = None
    r2_bucket: str | None = None

    @field_validator('database_url', mode='before')
    @classmethod
    def use_psycopg_v3_driver(cls, value):
        if isinstance(value, str):
            if value.startswith('postgres://'):
                return value.replace('postgres://', 'postgresql+psycopg://', 1)
            if value.startswith('postgresql://'):
                return value.replace('postgresql://', 'postgresql+psycopg://', 1)
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
