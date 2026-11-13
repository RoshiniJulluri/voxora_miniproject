import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Lightbulb, HelpCircle, BookOpen,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, Download, Trash2,
} from 'lucide-react'
import { fetchPodcastById, fetchPodcastAudio, fetchPodcastStatus, submitQuizAnswers, deletePodcast, retryPodcast } from '../services/podcastService.js'

/* ── Animated waveform bars ───────────────────────────── */
function Waveform({ playing }) {
  const heights = [10, 18, 28, 40, 50, 44, 34, 22, 14, 24, 38, 46, 36, 26, 16]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 52, flexShrink: 0 }}>
      {heights.map((h, i) => (
        <div key={i} className={playing ? 'wave-bar' : ''}
          style={{ width: 4, height: h, background: playing ? '#E85D2A' : '#DDD8CF', borderRadius: 2, animationDelay: `${i * 0.07}s` }}
        />
      ))}
    </div>
  )
}

/* ── Pill badge ───────────────────────────────────────── */
function Badge({ children, bg, color, border }) {
  return (
    <span style={{ background: bg, color, border: `1px solid ${border}`, borderRadius: 99, padding: '3px 11px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

/* ── Control icon button ──────────────────────────────── */
function CtrlBtn({ children, onClick, title, size = 36 }) {
  return (
    <button onClick={onClick} title={title}
      style={{ width: size, height: size, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, color: '#666', transition: 'background 0.15s, color 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#F4EFE5'; e.currentTarget.style.color = '#2B2A27' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#666' }}
    >{children}</button>
  )
}

/* ── Quiz Tab ──────────────────────────────────────────── */
function QuizTab({ quiz, podcastId }) {
  const [answers,   setAnswers]   = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [answerDetails, setAnswerDetails] = useState({})
  const [score,     setScore]     = useState(0)

  const submit = async () => {
    setSubmitting(true); setSubmitError('')
    try {
      const result = await submitQuizAnswers(podcastId, Object.entries(answers).map(([question_id, selected_answer]) => ({ question_id, selected_answer })))
      setScore(result.correct); setAnswerDetails(result.details || {}); setSubmitted(true)
    } catch (error) { setSubmitError(error.message) } finally { setSubmitting(false) }
  }

  const pct  = quiz.length ? Math.round((score / quiz.length) * 100) : 0
  const good = pct >= 60

  if (submitted) {
    return (
      <div>
        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0 20px', borderBottom: '1px solid #F4EFE5', marginBottom: 18 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', border: `5px solid ${good ? '#0B5D48' : '#E85D2A'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: good ? '#0B5D48' : '#E85D2A', lineHeight: 1 }}>{pct}%</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#2B2A27', fontSize: '1.05rem', marginBottom: 3 }}>{score}/{quiz.length} Correct</div>
            <div style={{ color: '#888', fontSize: '0.875rem' }}>
              {pct >= 80 ? '🌟 Excellent!' : pct >= 60 ? '👍 Good job!' : '📚 Keep learning!'}
            </div>
          </div>
        </div>
        {/* Per-question result */}
        {quiz.map((q, i) => {
          const chosen  = answers[q.id]
          const correct = chosen === answerDetails[q.id]?.correct_answer
          return (
            <div key={q.id} style={{ marginBottom: 12, background: correct ? '#F0FBF4' : '#FFF5F5', border: `1px solid ${correct ? 'rgba(11,93,72,0.18)' : 'rgba(220,38,38,0.18)'}`, borderRadius: 11, padding: '13px 16px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                {correct ? <CheckCircle2 size={17} color="#0B5D48" style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={17} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />}
                <div>
                  <p style={{ fontWeight: 600, color: '#2B2A27', fontSize: '0.875rem', marginBottom: 5, lineHeight: 1.4 }}>Q{i+1}. {q.question}</p>
                  {!correct && <p style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: 2 }}>Your answer: <strong>{q.options[chosen ?? -1] ?? '(none)'}</strong></p>}
                  <p style={{ fontSize: '0.8rem', color: '#0B5D48', marginBottom: 4 }}>Correct: <strong>{q.options[answerDetails[q.id]?.correct_answer]}</strong></p>
                  <p style={{ fontSize: '0.775rem', color: '#888', lineHeight: 1.5 }}>{answerDetails[q.id]?.explanation}</p>
                </div>
              </div>
            </div>
          )
        })}
        <button onClick={() => { setAnswers({}); setSubmitted(false); setScore(0) }}
          style={{ marginTop: 6, background: '#F4EFE5', border: '1px solid #E8E1D7', borderRadius: 8, padding: '8px 18px', fontSize: '0.875rem', fontWeight: 600, color: '#444', cursor: 'pointer', fontFamily: 'inherit' }}
        >Retake Quiz</button>
      </div>
    )
  }

  return (
    <div>
      {quiz.map((q, i) => (
        <div key={q.id} style={{ marginBottom: 22 }}>
          <p style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.9375rem', marginBottom: 10, lineHeight: 1.4 }}>
            <span style={{ color: '#BBB', marginRight: 7 }}>Q{i+1}.</span>{q.question}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, idx) => {
              const chosen = answers[q.id] === idx
              return (
                <button key={idx} type="button" onClick={() => setAnswers(a => ({ ...a, [q.id]: idx }))}
                  style={{ textAlign: 'left', padding: '10px 15px', borderRadius: 10, border: `1.5px solid ${chosen ? '#E85D2A' : '#E8E1D7'}`, background: chosen ? '#FFF3EE' : '#FAFAF8', color: chosen ? '#E85D2A' : '#2B2A27', fontWeight: chosen ? 700 : 400, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                >
                  <span style={{ fontWeight: 600, marginRight: 9, color: chosen ? '#E85D2A' : '#CCC' }}>{String.fromCharCode(65 + idx)}.</span>{opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
        {submitError && <p role="alert" style={{ color: '#c53030' }}>{submitError}</p>}
        <button onClick={submit} disabled={Object.keys(answers).length < quiz.length || submitting}
          style={{ background: Object.keys(answers).length < quiz.length ? '#E8E1D7' : '#E85D2A', color: Object.keys(answers).length < quiz.length ? '#AAA' : '#fff', border: 'none', borderRadius: 9, padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 700, cursor: Object.keys(answers).length < quiz.length ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.18s' }}
        >{submitting ? 'Submitting…' : 'Submit Quiz'}</button>
        {Object.keys(answers).length < quiz.length && (
          <span style={{ fontSize: '0.8rem', color: '#AAA' }}>
            {quiz.length - Object.keys(answers).length} question{quiz.length - Object.keys(answers).length !== 1 ? 's' : ''} remaining
          </span>
        )}
      </div>
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────── */
export default function PodcastPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [podcast, setPodcast] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [retrying, setRetrying] = useState(false)
  const audioRef = useRef(null)

  const [playing,  setPlaying]  = useState(false)
  const [elapsed,  setElapsed]  = useState(0)
  const [volume,   setVolume]   = useState(80)
  const [muted,    setMuted]    = useState(false)
  const [speed,    setSpeed]    = useState(1.0)
  const [tab,      setTab]      = useState('transcript')
  const totalSec = audioRef.current?.duration || podcast?.duration_actual * 60 || podcast?.duration_requested * 60 || 0

  useEffect(() => {
    let objectUrl
    let cancelled = false
    setPodcast(null); setLoadError(''); setAudioUrl('')
    fetchPodcastById(id).then(async result => {
      if (cancelled) return
      const paragraphs = (result.transcript || result.script || '').split(/\n\s*\n/).filter(Boolean)
      setPodcast({ ...result, level: result.knowledge_level, durationLabel: `${result.duration_actual || result.duration_requested} min`,
        transcript: paragraphs.map((text, index) => ({ time: `${String(Math.floor(index * (result.duration_requested * 60 / Math.max(paragraphs.length, 1)) / 60)).padStart(2, '0')}:${String(Math.floor(index * (result.duration_requested * 60 / Math.max(paragraphs.length, 1)) % 60)).padStart(2, '0')}`, text })),
        keyTakeaways: result.takeaways || [], quiz: result.quiz || [] })
      if (result.audio_url) {
        const blob = await fetchPodcastAudio(id)
        if (!cancelled) { objectUrl = URL.createObjectURL(blob); setAudioUrl(objectUrl) }
      }
    }).catch(error => { if (!cancelled) setLoadError(error.message) })
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = speed
    audio.volume = muted ? 0 : volume / 100
    if (playing) audio.play().catch(() => setPlaying(false))
    else audio.pause()
  }, [playing, speed, volume, muted, audioUrl])

  if (loadError || !podcast) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#555', padding: 24 }}>{loadError || 'Loading podcast…'}</div>

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const TABS = [
    { id: 'transcript', label: 'Transcript',    icon: BookOpen },
    { id: 'takeaways',  label: 'Key Takeaways', icon: Lightbulb },
    { id: 'quiz',       label: 'Quiz',          icon: HelpCircle },
  ]

  const handleDelete = async () => {
    if (!window.confirm('Delete this podcast permanently?')) return
    try { await deletePodcast(id); navigate('/my-podcasts', { replace: true }) }
    catch (error) { setLoadError(error.message) }
  }

  const handleRetry = async () => {
    setRetrying(true); setLoadError('')
    try {
      await retryPodcast(id)
      for (let attempt = 0; attempt < 180; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const status = await fetchPodcastStatus(id)
        setPodcast(current => ({ ...current, status: status.status, error_message: status.error_message }))
        if (status.status === 'failed') throw new Error(status.error_message || 'Podcast generation failed again.')
        if (status.status === 'completed') { window.location.reload(); return }
      }
      throw new Error('Podcast generation is taking longer than expected. Check back in your library.')
    } catch (error) {
      setPodcast(current => ({ ...current, status: 'failed', error_message: error.message }))
      setRetrying(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Back link row */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '20px 24px 0' }}>
        <button onClick={() => navigate('/my-podcasts')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.875rem', fontFamily: 'inherit', padding: 0, transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#2B2A27'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <ArrowLeft size={15} /> Back to My Podcasts
        </button>
      </div>

      {/* Main card */}
      <div style={{ maxWidth: 820, margin: '14px auto 48px', padding: '0 24px' }}>
        <div style={{ background: '#fff', border: '1px solid #EDE8DF', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 24px rgba(43,42,39,0.08)' }}>
          <audio ref={audioRef} src={audioUrl || undefined} onTimeUpdate={e => setElapsed(e.currentTarget.currentTime)} onLoadedMetadata={e => setElapsed(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} />

          {/* ── Header: Artwork + Info ──────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
            <div style={{ width: 190, minHeight: 170, background: 'linear-gradient(135deg,#0B5D48,#E85D2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, flexShrink: 0 }}>
              🎧
            </div>
            <div style={{ padding: '22px 26px', borderBottom: '1px solid #F4EFE5' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 11 }}>
                <Badge bg="#FFF3EE" color="#E85D2A" border="rgba(232,93,42,0.2)">{podcast.style}</Badge>
                <Badge bg="rgba(11,93,72,0.08)" color="#0B5D48" border="rgba(11,93,72,0.18)">{podcast.level}</Badge>
                <Badge bg="rgba(122,155,87,0.1)" color="#4D6E2A" border="rgba(122,155,87,0.22)">{podcast.language}</Badge>
              </div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 9 }}>
                {podcast.title}
              </h1>
                <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
                {podcast.description}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                {audioUrl && <a href={audioUrl} download={`${podcast.title}.wav`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '7px 11px' }}><Download size={14} /> Download</a>}
                <button onClick={handleDelete} className="btn-secondary" style={{ color: '#b42318', fontSize: '0.8rem', padding: '7px 11px' }}><Trash2 size={14} /> Delete</button>
              </div>
              {podcast.status === 'failed' && <div style={{ marginTop: 12 }}>
                <p role="alert" style={{ color: '#b42318', fontSize: '0.8rem', marginBottom: 8 }}>{podcast.error_message || 'Podcast generation failed.'}</p>
                <button type="button" onClick={handleRetry} disabled={retrying} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '7px 11px' }}>{retrying ? 'Retrying…' : 'Retry generation'}</button>
              </div>}
            </div>
          </div>

          {/* ── Player ─────────────────────────────── */}
          <div style={{ padding: '20px 26px 22px', borderBottom: '1px solid #F4EFE5' }}>
            {!audioUrl && <p style={{ color: '#9a5b00', fontSize: '0.82rem', marginBottom: 12 }}>Audio is unavailable for this podcast.</p>}
            {/* Waveform + seek row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <Waveform playing={playing} />
              <div style={{ flex: 1 }}>
                <div
                  style={{ height: 5, background: '#F0EBE0', borderRadius: 99, cursor: 'pointer', position: 'relative', overflow: 'visible' }}
                  onClick={e => {
                    const r = e.currentTarget.getBoundingClientRect()
                    const target = Math.floor(((e.clientX - r.left) / r.width) * totalSec)
                    if (audioRef.current && Number.isFinite(target)) audioRef.current.currentTime = target
                  }}
                >
                  <div style={{ width: `${(elapsed / totalSec) * 100}%`, height: '100%', background: 'linear-gradient(to right,#E85D2A,#E8A33D)', borderRadius: 99, transition: 'width 0.3s linear', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: -6, top: -4, width: 13, height: 13, background: '#E85D2A', borderRadius: '50%', border: '2.5px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: '0.75rem', color: '#BBB' }}>
                  <span>{fmt(elapsed)}</span>
                  <span>{fmt(totalSec)}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CtrlBtn onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, elapsed - 15) }} title="−15s"><SkipBack size={18} /></CtrlBtn>
                <CtrlBtn onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, elapsed - 60) }}><ChevronLeft size={20} /></CtrlBtn>

                {/* Play / Pause */}
                <button disabled={!audioUrl} onClick={() => setPlaying(p => !p)}
                  style={{ width: 50, height: 50, background: '#E85D2A', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 14px rgba(232,93,42,0.4)', transition: 'background 0.18s, transform 0.12s', margin: '0 4px' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#C44D20'}
                  onMouseLeave={e => e.currentTarget.style.background = '#E85D2A'}
                  onMouseDown={e =>  e.currentTarget.style.transform = 'scale(0.93)'}
                  onMouseUp={e =>    e.currentTarget.style.transform = 'scale(1)'}
                >
                  {playing
                    ? <div style={{ display: 'flex', gap: 4 }}><div style={{ width: 4, height: 18, background: '#fff', borderRadius: 2 }} /><div style={{ width: 4, height: 18, background: '#fff', borderRadius: 2 }} /></div>
                    : <Play size={20} color="#fff" style={{ marginLeft: 2 }} />}
                </button>

                <CtrlBtn onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(totalSec, elapsed + 60) }}><ChevronRight size={20} /></CtrlBtn>
                <CtrlBtn onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(totalSec, elapsed + 15) }} title="+15s"><SkipForward size={18} /></CtrlBtn>
              </div>

              {/* Speed + Volume */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
                  style={{ background: '#F4EFE5', border: '1px solid #E8E1D7', borderRadius: 7, padding: '5px 10px', fontSize: '0.8rem', color: '#444', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
                >
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(s => <option key={s} value={s}>{s}×</option>)}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <button onClick={() => setMuted(m => !m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', padding: 4 }}>
                    {(muted || volume === 0) ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  </button>
                  <input type="range" min={0} max={100} value={muted ? 0 : volume}
                    onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
                    style={{ width: 80, accentColor: '#E85D2A', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', borderBottom: '1px solid #F4EFE5' }}>
              {TABS.map(({ id: tid, label, icon: Icon }) => {
                const active = tab === tid
                return (
                  <button key={tid} onClick={() => setTab(tid)}
                    style={{ flex: 1, padding: '14px 10px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: active ? 700 : 500, color: active ? '#E85D2A' : '#888', borderBottom: `2.5px solid ${active ? '#E85D2A' : 'transparent'}`, transition: 'all 0.15s' }}
                  >
                    <Icon size={15} /> {label}
                  </button>
                )
              })}
            </div>

            <div style={{ padding: '18px 26px 24px', maxHeight: 380, overflowY: 'auto' }}>

              {/* Transcript */}
              {tab === 'transcript' && (
                <div>
                  {podcast.transcript.map((item, i) => {
                    const itemSec = item.time.split(':').reduce((a, b) => a * 60 + Number(b), 0)
                    const nextSec = podcast.transcript[i + 1]?.time.split(':').reduce((a, b) => a * 60 + Number(b), 0) ?? Infinity
                    const active  = elapsed >= itemSec && elapsed < nextSec
                    return (
                      <div key={i} onClick={() => setElapsed(itemSec)}
                        style={{ display: 'flex', gap: 14, padding: '10px 12px', borderRadius: 10, marginBottom: 4, cursor: 'pointer', background: active ? '#FFF3EE' : 'transparent', borderLeft: `3px solid ${active ? '#E85D2A' : 'transparent'}`, transition: 'background 0.2s, border-color 0.2s' }}
                      >
                        <span style={{ fontSize: '0.775rem', color: '#E85D2A', fontWeight: 700, whiteSpace: 'nowrap', marginTop: 3, minWidth: 36 }}>{item.time}</span>
                        <p style={{ color: active ? '#2B2A27' : '#555', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Key Takeaways */}
              {tab === 'takeaways' && (
                <div style={{ paddingTop: 4 }}>
                  {podcast.keyTakeaways.map((point, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, background: '#FFF3EE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Lightbulb size={14} color="#E85D2A" />
                      </div>
                      <p style={{ color: '#2B2A27', fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>{point}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quiz */}
              {tab === 'quiz' && <QuizTab quiz={podcast.quiz} podcastId={podcast.id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
