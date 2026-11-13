import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit3, User, BarChart2, Mic2, Globe, Clock, Sparkles, Loader2, ChevronDown } from 'lucide-react'
import AppLayout from '../components/AppLayout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { generatePodcast, fetchPodcastStatus, fetchProviderStatus, fetchProviderVoices } from '../services/podcastService.js'
import {
  userCategories, knowledgeLevels, podcastStyles,
  supportedLanguages, podcastDurations, suggestedTopics,
} from '../mock-data/podcasts.js'

/* ── Shared select component ──────────────────────────── */
function FormSelect({ label, icon: Icon, iconColor = '#0B5D48', value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.8125rem', fontWeight: 700, color: '#3D3B38', marginBottom: 8, letterSpacing: '0.01em' }}>
        <Icon size={13} color={iconColor} />
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', background: '#fff', border: '1.5px solid #DDD8CF', borderRadius: 9, padding: '10px 36px 10px 13px', color: '#2B2A27', fontSize: '0.9375rem', outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', transition: 'border-color 0.18s, box-shadow 0.18s' }}
          onFocus={e => { e.target.style.borderColor = '#E85D2A'; e.target.style.boxShadow = '0 0 0 3px rgba(232,93,42,0.1)' }}
          onBlur={e =>  { e.target.style.borderColor = '#DDD8CF'; e.target.style.boxShadow = 'none' }}
        >
          {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} color="#999" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

export default function GeneratePage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [topic,    setTopic]   = useState('')
  const [category, setCat]     = useState(user?.category || 'student')
  const [level,    setLevel]   = useState(user?.knowledge_level || 'intermediate')
  const [style,    setStyle]   = useState(user?.preferred_style || 'educational')
  const [language, setLang]    = useState(user?.preferred_language || 'en')
  const [duration, setDur]     = useState('5-10')
  const [custom,   setCustom]  = useState('')
  const [voice,    setVoice]   = useState(user?.preferred_voice || '')
  const [providers, setProviders] = useState(null)
  const [voices, setVoices] = useState([])
  const [providerError, setProviderError] = useState('')
  const [instructions, setInstructions] = useState('')
  const [statusText, setStatusText] = useState('')
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState('')

  useEffect(() => {
    let active = true
    fetchProviderStatus().then(async status => {
      if (!active) return
      setProviders(status)
      if (status.audio_generation) {
        try {
          const available = await fetchProviderVoices()
          if (!active) return
          setVoices(available)
          if (!voice && available.length) setVoice(available[0].voice_id)
        } catch (err) {
          if (active) setProviderError(err.message)
        }
      }
    }).catch(err => { if (active) setProviderError(err.message) })
    return () => { active = false }
  }, [])

  const compatibleVoices = voices.filter(item => {
    const locales = item.supported_locales?.length ? item.supported_locales : [item.locale].filter(Boolean)
    return locales.some(locale => locale.split('-', 1)[0].toLowerCase() === language.toLowerCase())
  })

  useEffect(() => {
    if (compatibleVoices.length && !compatibleVoices.some(item => item.voice_id === voice)) {
      setVoice(compatibleVoices[0].voice_id)
    } else if (!compatibleVoices.length && voice) {
      setVoice('')
    }
  }, [language, voices, voice])

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) { setError('Please enter a topic to generate your podcast.'); return }
    const durationMinutes = duration === 'custom' ? Number(custom) : podcastDurations.find(d => d.id === duration)?.minutes
    if (!durationMinutes || durationMinutes < 1 || durationMinutes > 180) { setError('Choose a duration between 1 and 180 minutes.'); return }
    if (providers && (!providers.script_generation || !providers.audio_generation)) {
      setError('Add your Gemini and Murf API keys in backend/.env, then restart the backend to generate a podcast.')
      return
    }
    if (providers?.audio_generation && !voices.length) {
      setError(providerError || 'No Murf Gen2 voices are available for this account. Check the API key and Murf API access.')
      return
    }
    if (!compatibleVoices.length) { setError('No Murf voices support this language. Choose another language.'); return }
    if (!voice.trim()) { setError('Choose a voice that supports the selected language.'); return }
    setError(''); setLoading(true); setStatusText('Queuing your podcast…')
    try {
      const job = await generatePodcast({ topic: topic.trim(), category, knowledge_level: level, style, language, duration_minutes: durationMinutes, voice: voice.trim() || null, additional_instructions: instructions.trim() })
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const status = await fetchPodcastStatus(job.id)
        setStatusText(status.status === 'generating_script' ? 'Writing your podcast script…' : status.status === 'generating_audio' ? 'Creating the audio…' : 'Finishing your podcast…')
        if (status.status === 'completed') { navigate(`/podcast/${job.id}`, { replace: true }); return }
        if (status.status === 'failed') throw new Error(status.error_message || 'Podcast generation failed.')
      }
    } catch (err) { setError(err.message) } finally { setLoading(false); setStatusText('') }
  }

  return (
    <AppLayout>
      {/* Page header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EDE8DF', padding: '18px 28px' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', marginBottom: 3 }}>Create Your Podcast</h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>Fill in your preferences and let AI craft a personalized podcast for you.</p>
      </div>

      {/* Form */}
      <div style={{ padding: '28px 28px 48px', maxWidth: 720, fontFamily: "'Inter', system-ui, sans-serif" }}>
        {error && (
          <div style={{ background: '#FFF5F5', border: '1px solid rgba(220,38,38,0.22)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem', color: '#c53030', display: 'flex', gap: 8 }}>
            ⚠ {error}
          </div>
        )}

        {providers && (!providers.script_generation || !providers.audio_generation) && (
          <div style={{ background: '#FFF9E8', border: '1px solid #F2D58B', borderRadius: 10, padding: '14px 16px', marginBottom: 20, color: '#684B0B', fontSize: '0.875rem', lineHeight: 1.6 }}>
            <strong>Connect your generation providers</strong>
            <div style={{ marginTop: 4 }}>Script generation: {providers.script_generation ? 'Ready' : 'Gemini API key needed'} · Voice audio: {providers.audio_generation ? 'Ready' : 'Murf API key needed'}</div>
            <div>Put the keys in <code>backend/.env</code> and restart the backend. Keep the keys out of the frontend.</div>
          </div>
        )}
        {providerError && providers?.audio_generation && (
          <div style={{ background: '#FFF9E8', border: '1px solid #F2D58B', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#684B0B', fontSize: '0.875rem' }}>{providerError}</div>
        )}

        <form onSubmit={handleGenerate}>

          {/* ── TOPIC ──────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.8125rem', fontWeight: 700, color: '#3D3B38', marginBottom: 8, letterSpacing: '0.01em' }}>
              <Edit3 size={13} color="#E85D2A" /> What do you want to listen about?
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Quantum Computing, Indian Economy, Climate Change..."
              rows={3}
              style={{ width: '100%', background: '#fff', border: '1.5px solid #DDD8CF', borderRadius: 10, padding: '12px 14px', color: '#2B2A27', fontSize: '0.9375rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.65, transition: 'border-color 0.18s, box-shadow 0.18s' }}
              onFocus={e => { e.target.style.borderColor = '#E85D2A'; e.target.style.boxShadow = '0 0 0 3px rgba(232,93,42,0.09)' }}
              onBlur={e =>  { e.target.style.borderColor = '#DDD8CF'; e.target.style.boxShadow = 'none' }}
            />
            {/* Suggestion chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10, alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#BBB', flexShrink: 0 }}>Try:</span>
              {suggestedTopics.slice(0, 7).map(t => (
                <button key={t} type="button" onClick={() => setTopic(t)}
                  style={{ background: '#F4EFE5', border: '1px solid #E8E1D7', borderRadius: 99, padding: '4px 12px', fontSize: '0.775rem', color: '#555', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', lineHeight: 1.4 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FFF3EE'; e.currentTarget.style.color = '#E85D2A'; e.currentTarget.style.borderColor = 'rgba(232,93,42,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F4EFE5'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#E8E1D7' }}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* ── Divider line ─────────────────────────── */}
          <div style={{ height: 1, background: '#F0EBE0', margin: '4px 0 20px' }} />

          {/* ── CATEGORY + LEVEL ──────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 18 }}>
            <FormSelect label="Who are you?" icon={User} iconColor="#0B5D48" value={category} onChange={setCat} options={userCategories} />
            <FormSelect label="Knowledge Level" icon={BarChart2} iconColor="#0B5D48" value={level} onChange={setLevel} options={knowledgeLevels} />
          </div>

          {/* ── STYLE + LANGUAGE ──────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 20 }}>
            <FormSelect label="Podcast Style" icon={Mic2} iconColor="#E85D2A" value={style} onChange={setStyle} options={podcastStyles} />
            <FormSelect label="Language" icon={Globe} iconColor="#E85D2A" value={language} onChange={setLang} options={supportedLanguages} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 20 }}>
            <div>
              <label className="label">Podcast voice</label>
              {voices.length > 0 ? (
                <select className="input" value={voice} onChange={e => setVoice(e.target.value)}>
                  {compatibleVoices.length
                    ? compatibleVoices.map(item => {
                      const locales = item.supported_locales?.length ? item.supported_locales : [item.locale].filter(Boolean)
                      const selectedLocale = locales.find(locale => locale.split('-', 1)[0].toLowerCase() === language.toLowerCase())
                      return <option key={item.voice_id} value={item.voice_id}>{item.name}{selectedLocale ? ` · ${selectedLocale}` : ''}</option>
                    })
                    : <option value="">No Murf voices support this language</option>}
                </select>
              ) : (
                <input className="input" value={voice} onChange={e => setVoice(e.target.value)} placeholder={providers?.audio_generation ? 'Loading Murf voices…' : 'Available after Murf setup'} disabled={!providers?.audio_generation} />
              )}
              <p style={{ color: '#888', fontSize: '0.75rem', marginTop: 5 }}>Showing {compatibleVoices.length} voices that support the selected language.</p>
            </div>
            <div>
              <label className="label">Additional instructions</label>
              <input className="input" value={instructions} onChange={e => setInstructions(e.target.value)} maxLength={2000} placeholder="Optional focus or examples" />
            </div>
          </div>

          {/* ── Divider line ─────────────────────────── */}
          <div style={{ height: 1, background: '#F0EBE0', margin: '4px 0 20px' }} />

          {/* ── DURATION ──────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.8125rem', fontWeight: 700, color: '#3D3B38', marginBottom: 12, letterSpacing: '0.01em' }}>
              <Clock size={13} color="#E8A33D" /> Podcast Duration
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {podcastDurations.map(d => {
                const active = duration === d.id
                return (
                  <button key={d.id} type="button" onClick={() => setDur(d.id)}
                    style={{ padding: '8px 18px', borderRadius: 99, border: `1.5px solid ${active ? '#E85D2A' : '#DDD8CF'}`, cursor: 'pointer', fontSize: '0.875rem', fontWeight: active ? 700 : 500, fontFamily: 'inherit', transition: 'all 0.15s', background: active ? '#E85D2A' : '#fff', color: active ? '#fff' : '#444' }}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
            {duration === 'custom' && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="number" min={1} max={180} value={custom} onChange={e => setCustom(e.target.value)} placeholder="Enter minutes"
                  style={{ width: 150, background: '#fff', border: '1.5px solid #DDD8CF', borderRadius: 9, padding: '9px 14px', color: '#2B2A27', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.18s' }}
                  onFocus={e => e.target.style.borderColor = '#E85D2A'}
                  onBlur={e =>  e.target.style.borderColor = '#DDD8CF'}
                />
                <span style={{ color: '#888', fontSize: '0.875rem' }}>minutes</span>
              </div>
            )}
          </div>

          {/* ── GENERATE BUTTON ──────────────────── */}
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#C44D20' : '#E85D2A', color: '#fff', border: 'none', borderRadius: 11, padding: '14px', fontSize: '1.0625rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(232,93,42,0.3)', transition: 'background 0.18s' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#C44D20' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#E85D2A' }}
          >
            {loading
              ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating your podcast…</>
              : <><Sparkles size={18} /> Generate My Podcast</>}
          </button>

          {/* Loading progress */}
          {loading && (
            <div style={{ marginTop: 16, background: '#fff', border: '1px solid #EDE8DF', borderRadius: 11, padding: '16px 20px' }}>
              <p style={{ fontSize: '0.8125rem', color: '#888', marginBottom: 10, textAlign: 'center' }}>
                ✨ {statusText}
              </p>
              <div style={{ height: 5, background: '#F0EBE0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right,#E85D2A,#E8A33D)', borderRadius: 99, animation: 'genProg 2.4s ease-out forwards' }} />
              </div>
              <style>{`@keyframes genProg { from { width:0 } to { width:92% } }`}</style>
            </div>
          )}
        </form>
      </div>
    </AppLayout>
  )
}
