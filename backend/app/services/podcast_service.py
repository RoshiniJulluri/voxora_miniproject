from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.models import Podcast, PodcastTakeaway, QuizQuestion
from app.services.gemini_service import generate_script
from app.services.tts_service import synthesize_audio


async def run_generation(podcast_id: str, database_url: str):
    engine = create_engine(database_url, pool_pre_ping=True)
    session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    db: Session = session_factory()
    try:
        podcast = db.get(Podcast, podcast_id)
        if not podcast:
            return
        try:
            podcast.status = 'generating_script'; db.commit()
            generated = await generate_script(podcast)
            podcast.title, podcast.description = generated.title, generated.description
            podcast.script = generated.script
            podcast.transcript = generated.script
            for i, text in enumerate(generated.takeaways):
                db.add(PodcastTakeaway(podcast_id=podcast.id, takeaway_text=text, display_order=i))
            for i, question in enumerate(generated.quiz):
                db.add(QuizQuestion(podcast_id=podcast.id, question=question.question, options=question.options,
                                    correct_answer=question.correct_answer, explanation=question.explanation, display_order=i))
            podcast.status = 'generating_audio'; db.commit()
            key, duration = await synthesize_audio(generated.script, podcast.voice, podcast.language)
            podcast.audio_storage_key = key
            podcast.audio_url = f'/api/v1/podcasts/{podcast.id}/audio'
            podcast.duration_actual = duration
            podcast.status = 'completed'; podcast.error_message = None; db.commit()
        except Exception as exc:
            db.rollback()
            podcast = db.get(Podcast, podcast_id)
            if podcast:
                podcast.status = 'failed'
                podcast.error_message = str(exc)[:500]
                db.commit()
    finally:
        db.close()
        engine.dispose()
