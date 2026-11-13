FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt \
    && useradd --create-home --shell /usr/sbin/nologin voxora \
    && mkdir -p /app/storage/audio \
    && chown -R voxora:voxora /app

COPY --chown=voxora:voxora app ./app
COPY --chown=voxora:voxora alembic ./alembic
COPY --chown=voxora:voxora alembic.ini ./alembic.ini

USER voxora
EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
