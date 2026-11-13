import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Headphones, ArrowRight, CheckCircle2, Mic2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import { userCategories, knowledgeLevels, supportedLanguages } from '../mock-data/podcasts.js'

const STEPS = ['About You', 'Your Level', 'Language']

const STEP_ICONS = ['👤', '📊', '🌐']

export default function OnboardingPage() {
  const { user, updatePreferences } = useAuth()
  const navigate = useNavigate()

  const [step, setStep]   = useState(0)
  const [prefs, setPrefs] = useState({ category: '', level: '', language: 'en' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isStepValid = () => {
    if (step === 0) return !!prefs.category
    if (step === 1) return !!prefs.level
    if (step === 2) return !!prefs.language
    return false
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) { setStep(step + 1); return }
    setSaving(true); setError('')
    try {
      await updatePreferences({ category: prefs.category, knowledge_level: prefs.level, preferred_language: prefs.language, preferred_style: 'educational', interests: [] })
      navigate('/dashboard', { replace: true })
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const sel = (key, val) => setPrefs(p => ({ ...p, [key]: val }))

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 600 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#0B5D48', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={18} color="#E85D2A" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2B2A27', letterSpacing: '-0.01em' }}>VOXORA</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', marginTop: 20, marginBottom: 6 }}>
            Let's personalise your experience
          </h1>
          <p style={{ color: '#888', fontSize: '0.9375rem' }}>
            Hello, {user?.name?.split(' ')[0] || 'there'}! Tell us a bit about yourself.
          </p>
          {error && <p role="alert" style={{ color: '#c53030', marginTop: 10 }}>{error}</p>}
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < step ? '#0B5D48' : i === step ? '#E85D2A' : '#E8E1D7', color: i <= step ? '#fff' : '#AAA', fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.3s', flexShrink: 0 }}>
                  {i < step ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: i === step ? '#E85D2A' : i < step ? '#0B5D48' : '#AAA', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ height: 2, flex: 1, background: i < step ? '#0B5D48' : '#E8E1D7', marginBottom: 20, transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <div style={{ background: '#fff', border: '1px solid #EDE8DF', borderRadius: 18, padding: '28px 28px 24px', boxShadow: '0 4px 20px rgba(43,42,39,0.07)' }}>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{STEP_ICONS[step]}</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {step === 0 && 'What best describes you?'}
              {step === 1 && 'What is your knowledge level?'}
              {step === 2 && 'Preferred podcast language?'}
            </h2>
            <p style={{ color: '#888', fontSize: '0.875rem' }}>
              {step === 0 && 'This helps us tailor podcast topics and depth for you.'}
              {step === 1 && 'We\'ll adjust the complexity and terminology accordingly.'}
              {step === 2 && 'You can always change this later in settings.'}
            </p>
          </div>

          {/* Step 0 – Category */}
          {step === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {userCategories.map(({ id, label }) => {
                const active = prefs.category === id
                const icons  = { student: '🎓', professional: '💼', researcher: '🔬', educator: '📚', general: '🙋' }
                return (
                  <button key={id} onClick={() => sel('category', id)}
                    style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 11, border: `2px solid ${active ? '#E85D2A' : '#EDE8DF'}`, background: active ? '#FFF3EE' : '#FAFAF8', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 7 }}>{icons[id] || '👤'}</div>
                    <div style={{ fontWeight: 700, color: active ? '#E85D2A' : '#2B2A27', fontSize: '0.9rem' }}>{label}</div>
                    {active && <div style={{ marginTop: 6 }}><CheckCircle2 size={14} color="#E85D2A" /></div>}
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 1 – Level */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {knowledgeLevels.map(({ id, label }) => {
                const active  = prefs.level === id
                const descs   = { beginner: 'New to this topic — start from the basics', intermediate: 'Some familiarity — go a bit deeper', professional: 'Expert level — full technical depth' }
                const icons   = { beginner: '🌱', intermediate: '📈', professional: '🏆' }
                return (
                  <button key={id} onClick={() => sel('level', id)}
                    style={{ textAlign: 'left', padding: '14px 18px', borderRadius: 11, border: `2px solid ${active ? '#E85D2A' : '#EDE8DF'}`, background: active ? '#FFF3EE' : '#FAFAF8', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s' }}
                  >
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{icons[id]}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: active ? '#E85D2A' : '#2B2A27', fontSize: '0.9375rem', marginBottom: 2, textTransform: 'capitalize' }}>{label}</div>
                      <div style={{ color: '#888', fontSize: '0.8rem' }}>{descs[id]}</div>
                    </div>
                    {active && <CheckCircle2 size={18} color="#E85D2A" style={{ flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 2 – Language */}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
              {supportedLanguages.map(({ id, label }) => {
                const active = prefs.language === id
                const flags  = { en: '🇬🇧', te: '🇮🇳', hi: '🇮🇳', ta: '🇮🇳', kn: '🇮🇳', ml: '🇮🇳', mr: '🇮🇳', bn: '🇮🇳', gu: '🇮🇳', pa: '🇮🇳', or: '🇮🇳', as: '🇮🇳', ur: '🇵🇰' }
                return (
                  <button key={id} onClick={() => sel('language', id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: `2px solid ${active ? '#E85D2A' : '#EDE8DF'}`, background: active ? '#FFF3EE' : '#FAFAF8', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                  >
                    <span style={{ fontSize: 18 }}>{flags[id] || '🌐'}</span>
                    <span style={{ fontWeight: active ? 700 : 500, color: active ? '#E85D2A' : '#2B2A27', fontSize: '0.875rem' }}>{label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid #F0EBE0' }}>
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              style={{ background: 'none', border: '1.5px solid #E8E1D7', borderRadius: 9, padding: '9px 18px', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, color: step === 0 ? '#CCC' : '#555', cursor: step === 0 ? 'not-allowed' : 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
            >← Back</button>
            <span style={{ color: '#AAA', fontSize: '0.8125rem' }}>{step + 1} / {STEPS.length}</span>
            <button onClick={handleNext} disabled={!isStepValid() || saving}
              style={{ background: isStepValid() ? '#E85D2A' : '#E8E1D7', color: isStepValid() ? '#fff' : '#AAA', border: 'none', borderRadius: 9, padding: '10px 22px', fontFamily: 'inherit', fontSize: '0.9375rem', fontWeight: 700, cursor: isStepValid() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s', boxShadow: isStepValid() ? '0 2px 10px rgba(232,93,42,0.3)' : 'none' }}
            >
              {saving ? 'Saving…' : step === STEPS.length - 1 ? 'Start Listening 🎧' : <>Continue <ArrowRight size={15} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
