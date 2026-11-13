from functools import lru_cache
from mimetypes import guess_type
from pathlib import Path

from app.core.config import settings


@lru_cache
def _r2_client():
    if not all((settings.r2_endpoint_url, settings.r2_access_key_id, settings.r2_secret_access_key, settings.r2_bucket)):
        raise RuntimeError('R2 audio storage is not configured. Set the R2 endpoint, access key, secret key, and bucket.')
    import boto3
    return boto3.client(
        's3', endpoint_url=settings.r2_endpoint_url, region_name='auto',
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
    )


def _local_path(key: str) -> tuple[Path, Path]:
    root = Path(settings.audio_storage_path).resolve()
    path = (root / key).resolve()
    if root not in path.parents:
        raise RuntimeError('Invalid audio storage path.')
    return root, path


def save_audio(key: str, audio: bytes) -> None:
    if settings.audio_storage_mode == 'r2':
        _r2_client().put_object(Bucket=settings.r2_bucket, Key=key, Body=audio, ContentType=guess_type(key)[0] or 'application/octet-stream')
        return
    if settings.audio_storage_mode != 'local':
        raise RuntimeError(f'Unsupported audio storage mode: {settings.audio_storage_mode}.')
    root, path = _local_path(key)
    root.mkdir(parents=True, exist_ok=True)
    path.write_bytes(audio)


def read_audio(key: str) -> bytes:
    if settings.audio_storage_mode == 'r2':
        try:
            return _r2_client().get_object(Bucket=settings.r2_bucket, Key=key)['Body'].read()
        except Exception as exc:
            if getattr(exc, 'response', {}).get('Error', {}).get('Code') in ('NoSuchKey', '404'):
                raise FileNotFoundError(key) from exc
            raise
    if settings.audio_storage_mode != 'local':
        raise RuntimeError(f'Unsupported audio storage mode: {settings.audio_storage_mode}.')
    _, path = _local_path(key)
    return path.read_bytes()


def delete_audio(key: str) -> None:
    if settings.audio_storage_mode == 'r2':
        _r2_client().delete_object(Bucket=settings.r2_bucket, Key=key)
        return
    if settings.audio_storage_mode != 'local':
        raise RuntimeError(f'Unsupported audio storage mode: {settings.audio_storage_mode}.')
    _, path = _local_path(key)
    if path.exists():
        path.unlink()
