import base64
import asyncio
from io import BytesIO
import random
import re
import uuid
import wave

import httpx

from app.core.config import settings
from app.services.audio_storage import save_audio


def _split_for_murf(text: str, limit: int = 2800) -> list[str]:
    """Split narration below Murf's 3,000-character request limit at sentence boundaries."""
    parts: list[str] = []
    current = ''
    sentences = re.split(r'(?<=[.!?])\s+|\n+', text.strip())
    for sentence in sentences:
        remaining = sentence.strip()
        while remaining:
            room = limit - len(current) - (1 if current else 0)
            if len(remaining) <= room:
                current = f'{current} {remaining}'.strip()
                remaining = ''
                continue
            if current:
                parts.append(current)
                current = ''
                continue
            split_at = remaining.rfind(' ', 0, limit + 1)
            if split_at <= 0:
                split_at = limit
            parts.append(remaining[:split_at].strip())
            remaining = remaining[split_at:].strip()
    if current:
        parts.append(current)
    return [part for part in parts if part]


async def list_voices() -> list[dict]:
    """Return the voices enabled for this Murf account (never expose its key)."""
    if not settings.murf_api_key:
        return []
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            'https://api.murf.ai/v1/speech/voices',
            params={'model': 'gen2'},
            headers={'api-key': settings.murf_api_key},
        )
        response.raise_for_status()
    voices = response.json()
    return [
        {'voice_id': voice['voiceId'], 'name': voice.get('displayName') or voice['voiceId'],
         'locale': voice.get('locale'), 'supported_locales': list((voice.get('supportedLocales') or {}).keys()),
         'gender': voice.get('gender')}
        for voice in voices if voice.get('voiceId')
    ]


async def _locale_for_voice(voice_id: str, language: str) -> str:
    voice = next((item for item in await list_voices() if item['voice_id'] == voice_id), None)
    if not voice:
        raise RuntimeError(f'The voice "{voice_id}" is not available to this Murf account. Refresh the voice list and choose an available voice.')
    supported = voice['supported_locales'] or ([voice['locale']] if voice.get('locale') else [])
    matching = [locale for locale in supported if locale.split('-', 1)[0].lower() == language.lower()]
    if not matching:
        choices = ', '.join(supported) or 'none reported'
        raise RuntimeError(f'The Murf voice "{voice_id}" does not support language "{language}". Supported locales: {choices}.')
    primary = voice.get('locale')
    return primary if primary in matching else matching[0]


async def synthesize_audio(text: str, voice: str | None, language: str) -> tuple[str, int | None]:
    if settings.audio_storage_mode not in ('local', 'r2'):
        raise RuntimeError('Audio storage mode must be local or r2.')
    if not settings.murf_api_key:
        raise RuntimeError('Murf is not configured. Set MURF_API_KEY on the backend.')
    if not voice:
        raise RuntimeError('Choose a Murf voice before generating audio.')
    locale = await _locale_for_voice(voice, language)
    chunks = _split_for_murf(text)
    audio_frames: list[bytes] = []
    wav_params = None
    duration_seconds = 0.0
    async with httpx.AsyncClient(timeout=180) as client:
        for index, chunk in enumerate(chunks, start=1):
            body = {'text': chunk, 'voiceId': voice, 'format': 'WAV', 'channelType': 'MONO', 'encodeAsBase64': True, 'modelVersion': 'GEN2'}
            body['locale'] = locale
            response = None
            for attempt in range(3):
                try:
                    response = await client.post('https://api.murf.ai/v1/speech/generate', headers={'api-key': settings.murf_api_key, 'Content-Type': 'application/json'}, json=body)
                except httpx.TransportError as exc:
                    if attempt == 2:
                        raise RuntimeError('Murf could not be reached after several attempts. Retry audio generation in a minute.') from exc
                    await asyncio.sleep(2 ** (attempt + 1) + random.uniform(0, 0.5))
                    continue
                if response.is_success or response.status_code not in (429, 500, 502, 503, 504):
                    break
                if attempt < 2:
                    retry_after = response.headers.get('Retry-After')
                    try:
                        delay = min(float(retry_after), 10) if retry_after else 2 ** (attempt + 1)
                    except ValueError:
                        delay = 2 ** (attempt + 1)
                    await asyncio.sleep(delay + random.uniform(0, 0.5))
            if response is None:
                raise RuntimeError('Murf did not return an audio response. Retry audio generation in a minute.')
            if not response.is_success:
                if response.status_code in (429, 500, 502, 503, 504):
                    raise RuntimeError(f'Murf is temporarily unavailable ({response.status_code}) after several attempts. Retry audio generation in a minute.')
                try:
                    error_body = response.json()
                    provider_detail = error_body.get('error_message') or error_body.get('message') or error_body.get('error') or response.text
                except ValueError:
                    provider_detail = response.text
                raise RuntimeError(f'Murf rejected audio chunk {index} of {len(chunks)}: {str(provider_detail)[:400]}')
            data = response.json()
            encoded = data.get('encodedAudio')
            if not encoded:
                raise RuntimeError(f'Murf did not return audio for chunk {index} of {len(chunks)}.')
            audio_bytes = base64.b64decode(encoded, validate=True)
            try:
                with wave.open(BytesIO(audio_bytes), 'rb') as wav_file:
                    params = wav_file.getparams()
                    frames = wav_file.readframes(wav_file.getnframes())
            except (wave.Error, EOFError) as exc:
                raise RuntimeError(f'Murf returned an unsupported audio file for chunk {index}.') from exc
            if wav_params is None:
                wav_params = params
            elif (params.nchannels, params.sampwidth, params.framerate, params.comptype) != (wav_params.nchannels, wav_params.sampwidth, wav_params.framerate, wav_params.comptype):
                raise RuntimeError('Murf returned audio chunks with incompatible formats.')
            audio_frames.append(frames)
            duration_seconds += float(data.get('audioLengthInSeconds') or (len(frames) / (params.nchannels * params.sampwidth * params.framerate)))
    if not audio_frames or wav_params is None:
        raise RuntimeError('Murf returned no audio.')
    combined = BytesIO()
    with wave.open(combined, 'wb') as output:
        output.setparams(wav_params)
        output.writeframes(b''.join(audio_frames))
    key = f'{uuid.uuid4()}.wav'
    save_audio(key, combined.getvalue())
    return key, round(duration_seconds / 60) or None
