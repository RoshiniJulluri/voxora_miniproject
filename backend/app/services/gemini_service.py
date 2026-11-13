import asyncio
import random

import httpx
from pydantic import BaseModel, Field, ValidationError

from app.core.config import settings
from app.models import Podcast


class GeneratedQuizQuestion(BaseModel):
    question: str
    options: list[str] = Field(min_length=2, max_length=8)
    correct_answer: int = Field(ge=0)
    explanation: str


class GeneratedPodcast(BaseModel):
    title: str
    description: str
    script: str
    takeaways: list[str]
    quiz: list[GeneratedQuizQuestion]


async def generate_script(podcast: Podcast) -> GeneratedPodcast:
    if not settings.gemini_api_key:
        raise RuntimeError('Gemini is not configured. Set GEMINI_API_KEY on the backend.')
    schema = {
        'type': 'object',
        'properties': {
            'title': {'type': 'string'},
            'description': {'type': 'string'},
            'script': {'type': 'string'},
            'takeaways': {'type': 'array', 'items': {'type': 'string'}},
            'quiz': {'type': 'array', 'items': {'type': 'object', 'properties': {
                'question': {'type': 'string'},
                'options': {'type': 'array', 'items': {'type': 'string'}},
                'correct_answer': {'type': 'integer'},
                'explanation': {'type': 'string'},
            }, 'required': ['question', 'options', 'correct_answer', 'explanation']}},
        },
        'required': ['title', 'description', 'script', 'takeaways', 'quiz'],
    }
    prompt = (f"Write an original spoken podcast for topic: {podcast.topic}. Audience knowledge: {podcast.knowledge_level}. "
              f"Style: {podcast.style}. Language: {podcast.language}. Target duration: {podcast.duration_requested} minutes. "
              'Use accurate, cautious claims and no fabricated citations. Ensure script has a clear intro, coherent sections and conclusion. '
              f"Additional instructions: {podcast.additional_instructions}. "
              'Provide 3-6 concise takeaways and 3-5 quiz questions. Correct answer uses zero-based option index.')
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent'
    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json', 'responseJsonSchema': schema}}
    retryable_statuses = {429, 500, 502, 503, 504}
    async with httpx.AsyncClient(timeout=90) as client:
        response = None
        for attempt in range(5):
            try:
                response = await client.post(url, headers={'x-goog-api-key': settings.gemini_api_key}, json=body)
            except httpx.TransportError as exc:
                if attempt == 4:
                    raise RuntimeError('Could not reach Gemini after several attempts. Check your connection and retry the podcast.') from exc
                await asyncio.sleep(min(2 ** attempt, 12) + random.uniform(0, 0.5))
                continue
            if response.is_success:
                break
            detail = ''
            try:
                payload_error = response.json().get('error', {})
                detail = payload_error.get('message') or payload_error.get('status') or ''
            except (ValueError, AttributeError):
                detail = response.text[:300]
            quota_exhausted = response.status_code == 429 and any(term in detail.lower() for term in ('daily quota', 'quota exceeded', 'billing'))
            if response.status_code in retryable_statuses and attempt < 4 and not quota_exhausted:
                retry_after = response.headers.get('Retry-After')
                try:
                    delay = min(float(retry_after), 15) if retry_after else min(2 ** (attempt + 1), 12)
                except ValueError:
                    delay = min(2 ** (attempt + 1), 12)
                await asyncio.sleep(delay + random.uniform(0, 0.5))
                continue
            if response.status_code == 503:
                raise RuntimeError('Gemini is temporarily overloaded. It was retried several times; please retry this podcast in a minute.')
            if response.status_code == 429:
                raise RuntimeError(f'Gemini usage limit reached: {detail or "check your API quota and billing"}.')
            raise RuntimeError(f'Gemini request failed ({response.status_code}): {detail or "check your API key and model settings"}.')
        if response is None or not response.is_success:
            raise RuntimeError('Gemini is temporarily unavailable. Please retry this podcast in a minute.')
    try:
        data = response.json()
        text = data['candidates'][0]['content']['parts'][0]['text']
        result = GeneratedPodcast.model_validate_json(text)
        if not result.script.strip() or any(q.correct_answer >= len(q.options) for q in result.quiz):
            raise ValueError('Generated podcast content failed validation')
        return result
    except (KeyError, IndexError, ValidationError, ValueError) as exc:
        raise RuntimeError('Gemini returned invalid podcast content.') from exc
