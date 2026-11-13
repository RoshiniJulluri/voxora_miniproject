import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.dependencies import get_current_user
from app.models import Podcast, QuizQuestion
from app.routes.api import get_preferences, health, login, owned_podcast, put_preferences, register, submit_quiz
from app.schemas import LoginIn, PreferenceIn, QuizAnswerIn, QuizSubmitIn, RegisterIn


def create_user(db, email='person@example.com'):
    result = register(RegisterIn(full_name='Test Person', email=email, password='a-secure-password-123'), db)
    db.commit()
    return result['user'], result['access_token']


def test_health_reports_database(db):
    assert health(db) == {'status': 'ok', 'database': 'connected'}


def test_registration_duplicate_login_and_protected_me(db):
    user, token = create_user(db)
    with pytest.raises(HTTPException) as duplicate:
        register(RegisterIn(full_name='Test Person', email=user.email, password='a-secure-password-123'), db)
    assert duplicate.value.status_code == 409
    assert login(LoginIn(email=user.email, password='a-secure-password-123'), db)['user'].id == user.id
    with pytest.raises(HTTPException) as wrong:
        login(LoginIn(email=user.email, password='incorrect'), db)
    assert wrong.value.status_code == 401
    credentials = HTTPAuthorizationCredentials(scheme='Bearer', credentials=token)
    assert get_current_user(credentials, db).id == user.id
    with pytest.raises(HTTPException) as no_auth:
        get_current_user(None, db)
    assert no_auth.value.status_code == 401


def test_preferences_persist_and_complete_onboarding(db):
    user, _ = create_user(db)
    payload = PreferenceIn(preferred_language='te', knowledge_level='intermediate', preferred_style='storytelling', category='student', interests=['science'])
    result = put_preferences(payload, user, db)
    assert result.preferred_language == 'te'
    assert result.interests == ['science']
    assert user.onboarding_complete is True
    assert get_preferences(user, db).knowledge_level == 'intermediate'


def test_podcast_access_is_owner_scoped(db):
    owner, _ = create_user(db, 'owner@example.com')
    other, _ = create_user(db, 'other@example.com')
    podcast = Podcast(user_id=owner.id, topic='Ocean science', knowledge_level='beginner', style='educational', language='en', duration_requested=3)
    db.add(podcast); db.commit(); db.refresh(podcast)
    assert owned_podcast(podcast.id, owner, db).id == podcast.id
    with pytest.raises(HTTPException) as forbidden:
        owned_podcast(podcast.id, other, db)
    assert forbidden.value.status_code == 404


def test_quiz_submission_saves_score_and_answers(db):
    owner, _ = create_user(db)
    podcast = Podcast(user_id=owner.id, topic='Ocean science', knowledge_level='beginner', style='educational', language='en', duration_requested=3)
    db.add(podcast); db.flush()
    question = QuizQuestion(podcast_id=podcast.id, question='Largest ocean?', options=['Atlantic', 'Pacific'], correct_answer=1, explanation='The Pacific is largest.', display_order=0)
    db.add(question); db.commit(); db.refresh(podcast); db.refresh(question)
    result = submit_quiz(podcast.id, QuizSubmitIn(answers=[QuizAnswerIn(question_id=question.id, selected_answer=1)]), owner, db)
    assert result['score'] == 100
    assert result['correct'] == 1
    assert result['details'][question.id]['correct_answer'] == 1
