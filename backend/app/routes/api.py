import mimetypes

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.database.connection import get_db
from app.dependencies import get_current_user
from app.models import Podcast, Preference, QuizAnswer, QuizAttempt, QuizQuestion, User
from app.schemas import AuthOut, LoginIn, PodcastGenerateIn, PreferenceIn, PreferenceOut, QuizSubmitIn, RegisterIn, UserOut
from app.services.podcast_service import run_generation
from app.services.tts_service import list_voices
from app.services.audio_storage import delete_audio, read_audio

router = APIRouter()


@router.get('/health')
def health(db: Session = Depends(get_db)):
    from sqlalchemy import text
    db.execute(text('SELECT 1'))
    return {'status': 'ok', 'database': 'connected'}


@router.get('/providers/status')
def provider_status(user: User = Depends(get_current_user)):
    return {'script_generation': bool(settings.gemini_api_key), 'audio_generation': bool(settings.murf_api_key)}


@router.get('/providers/voices')
async def provider_voices(user: User = Depends(get_current_user)):
    if not settings.murf_api_key:
        return []
    try:
        return await list_voices()
    except Exception as exc:
        raise HTTPException(status_code=502, detail='Could not load voices from Murf. Check the Murf API key and account access.') from exc


@router.post('/auth/register', response_model=AuthOut, status_code=201)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail='An account with this email already exists.')
    user = User(full_name=payload.full_name.strip(), email=email, password_hash=hash_password(payload.password))
    db.add(user); db.commit(); db.refresh(user)
    return {'access_token': create_access_token(user.id), 'user': user}


@router.post('/auth/login', response_model=AuthOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid email or password.')
    return {'access_token': create_access_token(user.id), 'user': user}


@router.get('/auth/me', response_model=UserOut)
@router.get('/users/me', response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.put('/users/me', response_model=UserOut)
def update_me(payload: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if 'full_name' in payload:
        name = str(payload['full_name']).strip()
        if not name or len(name) > 120:
            raise HTTPException(status_code=422, detail='Full name must contain 1 to 120 characters.')
        user.full_name = name
    db.commit(); db.refresh(user)
    return user


@router.post('/auth/logout', status_code=204)
def logout(user: User = Depends(get_current_user)):
    # Bearer tokens are stateless; clients discard them. Token expires after the configured lifetime.
    return Response(status_code=204)


@router.get('/preferences', response_model=PreferenceOut)
def get_preferences(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    preference = db.scalar(select(Preference).where(Preference.user_id == user.id))
    if not preference:
        preference = Preference(user_id=user.id); db.add(preference); db.commit(); db.refresh(preference)
    return preference


@router.put('/preferences', response_model=PreferenceOut)
def put_preferences(payload: PreferenceIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    preference = db.scalar(select(Preference).where(Preference.user_id == user.id))
    if not preference:
        preference = Preference(user_id=user.id); db.add(preference)
    for key, value in payload.model_dump().items():
        setattr(preference, key, value)
    user.onboarding_complete = True
    db.commit(); db.refresh(preference)
    return preference


def podcast_out(p: Podcast):
    return {'id': p.id, 'title': p.title, 'topic': p.topic, 'category': p.category, 'description': p.description,
            'knowledge_level': p.knowledge_level, 'style': p.style, 'language': p.language,
            'duration_requested': p.duration_requested, 'duration_actual': p.duration_actual,
            'script': p.script, 'transcript': p.transcript, 'audio_url': p.audio_url, 'status': p.status,
            'error_message': p.error_message, 'created_at': p.created_at,
            'takeaways': [t.takeaway_text for t in p.takeaways],
            'quiz': [{'id': q.id, 'question': q.question, 'options': q.options, 'explanation': q.explanation} for q in p.questions]}


def owned_podcast(podcast_id: str, user: User, db: Session) -> Podcast:
    podcast = db.scalar(select(Podcast).where(Podcast.id == podcast_id, Podcast.user_id == user.id))
    if not podcast:
        raise HTTPException(status_code=404, detail='Podcast not found.')
    return podcast


@router.post('/podcasts/generate', status_code=202)
def generate(payload: PodcastGenerateIn, background: BackgroundTasks, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    podcast = Podcast(user_id=user.id, topic=payload.topic.strip(), category=payload.category,
                      knowledge_level=payload.knowledge_level, style=payload.style, language=payload.language,
                      duration_requested=payload.duration_minutes, voice=payload.voice,
                      additional_instructions=payload.additional_instructions, status='queued')
    db.add(podcast); db.commit(); db.refresh(podcast)
    background.add_task(run_generation, podcast.id, settings.database_url)
    return {'id': podcast.id, 'status': podcast.status}


@router.get('/podcasts')
def list_podcasts(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Podcast).where(Podcast.user_id == user.id).order_by(Podcast.created_at.desc())).all()
    return [podcast_out(p) for p in rows]


@router.get('/podcasts/{podcast_id}')
def get_podcast(podcast_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return podcast_out(owned_podcast(podcast_id, user, db))


@router.get('/podcasts/{podcast_id}/status')
def get_status(podcast_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = owned_podcast(podcast_id, user, db)
    return {'id': p.id, 'status': p.status, 'error_message': p.error_message}


@router.delete('/podcasts/{podcast_id}', status_code=204)
def delete_podcast(podcast_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = owned_podcast(podcast_id, user, db)
    if p.audio_storage_key:
        delete_audio(p.audio_storage_key)
    db.delete(p); db.commit()
    return Response(status_code=204)


@router.post('/podcasts/{podcast_id}/retry', status_code=202)
def retry(podcast_id: str, background: BackgroundTasks, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = owned_podcast(podcast_id, user, db)
    if p.status != 'failed': raise HTTPException(status_code=409, detail='Only failed podcasts can be retried.')
    p.status = 'queued'; p.error_message = None; p.title = 'Podcast in progress'; p.description = ''; p.script = ''; p.transcript = ''
    p.takeaways.clear(); p.questions.clear(); db.commit()
    background.add_task(run_generation, p.id, settings.database_url)
    return {'id': p.id, 'status': p.status}


@router.get('/podcasts/{podcast_id}/quiz')
def get_quiz(podcast_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = owned_podcast(podcast_id, user, db)
    return [{'id': q.id, 'question': q.question, 'options': q.options, 'display_order': q.display_order} for q in p.questions]


@router.post('/podcasts/{podcast_id}/quiz/submit')
def submit_quiz(podcast_id: str, payload: QuizSubmitIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = owned_podcast(podcast_id, user, db)
    questions = {q.id: q for q in p.questions}
    if len(payload.answers) != len(questions) or {a.question_id for a in payload.answers} != set(questions):
        raise HTTPException(status_code=422, detail='Submit one answer for every quiz question.')
    attempt = QuizAttempt(user_id=user.id, podcast_id=p.id, total_questions=len(questions), score=0)
    db.add(attempt); db.flush()
    correct = 0
    details = {}
    for answer in payload.answers:
        q = questions[answer.question_id]
        if answer.selected_answer >= len(q.options): raise HTTPException(status_code=422, detail='Selected answer is invalid.')
        is_correct = answer.selected_answer == q.correct_answer
        correct += int(is_correct)
        details[q.id] = {'correct_answer': q.correct_answer, 'explanation': q.explanation}
        db.add(QuizAnswer(attempt_id=attempt.id, question_id=q.id, selected_answer=answer.selected_answer, is_correct=is_correct))
    attempt.score = round(correct * 100 / len(questions)) if questions else 0
    db.commit()
    return {'score': attempt.score, 'correct': correct, 'total': len(questions), 'details': details}


@router.get('/podcasts/{podcast_id}/audio')
def get_audio(podcast_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = owned_podcast(podcast_id, user, db)
    if not p.audio_storage_key: raise HTTPException(status_code=404, detail='Audio is not available.')
    try:
        audio = read_audio(p.audio_storage_key)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail='Audio is not available.') from None
    media_type = mimetypes.guess_type(p.audio_storage_key)[0] or 'application/octet-stream'
    return Response(audio, media_type=media_type, headers={'Content-Disposition': f'inline; filename="{p.audio_storage_key}"'})
