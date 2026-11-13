import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Headphones, User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'

/* ── Shared input field component ──────────────────────────
   IMPORTANT: Defined at module scope (outside RegisterPage)
   so React sees a stable component identity across renders.
   Defining it inside the page function causes React to
   unmount/remount the input on every keystroke, losing focus.
─────────────────────────────────────────────────────────── */
function Field({ label, type = 'text', Icon, placeholder, extra = {}, value, onChange, showToggle, showPw, onTogglePw }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: '#4A4845', marginBottom: 7, letterSpacing: '0.01em' }}>
        <Icon size={13} color="#0B5D48" /> {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#C0BAB0', pointerEvents: 'none' }} />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          placeholder={placeholder}
          style={{ width: '100%', background: '#fff', border: '1.5px solid #E8E1D7', borderRadius: 9, padding: '11px 14px 11px 40px', color: '#2B2A27', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.18s, box-shadow 0.18s', ...extra }}
          onFocus={e => { e.target.style.borderColor = '#E85D2A'; e.target.style.boxShadow = '0 0 0 3px rgba(232,93,42,0.1)' }}
          onBlur={e =>  { e.target.style.borderColor = '#E8E1D7'; e.target.style.boxShadow = 'none' }}
        />
        {showToggle && (
          <button type="button" onClick={onTogglePw}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#C0BAB0', display: 'flex', alignItems: 'center' }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoad]  = useState(false)
  const [error, setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8)       { setError('Password must be at least 8 characters.'); return }
    setLoad(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/onboarding', { replace: true })
    } catch (err) { setError(err.message) }
    finally { setLoad(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Left brand panel ───────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{ width: '44%', flexShrink: 0, background: 'linear-gradient(150deg,#0B5D48 0%,#094A39 55%,#052E24 100%)', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 360, height: 360, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, background: 'rgba(232,93,42,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ padding: '28px 36px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.14)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={18} color="#E85D2A" />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.01em' }}>VOXORA</span>
          </Link>
        </div>

        {/* Centre content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 48px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 68, lineHeight: 1, marginBottom: 28 }}>🎧</div>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 16 }}>
            Create your first<br />personalized podcast<br />experience.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: 300 }}>
            Choose your topic, set your preferences, and let VOXORA craft an AI-generated podcast just for you.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 36, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', justifyContent: 'center' }}>
            {[['Free', 'To Start'], ['13+', 'Languages'], ['6', 'Podcast Styles']].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: '#E85D2A', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>{v}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ height: 40 }} />
      </div>

      {/* ── Right form panel ───────────────────────────── */}
      <div style={{ flex: 1, background: '#FAF7F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>

        {/* Mobile logo */}
        <Link to="/" className="lg:hidden" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, background: '#0B5D48', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headphones size={16} color="#E85D2A" />
          </div>
          <span style={{ fontWeight: 800, color: '#2B2A27', fontSize: '1.05rem' }}>VOXORA</span>
        </Link>

        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Back link */}
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#AAA', fontSize: '0.8125rem', textDecoration: 'none', marginBottom: 24, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#2B2A27'}
            onMouseLeave={e => e.currentTarget.style.color = '#AAA'}
          >
            <ArrowLeft size={14} /> Back to login
          </Link>

          {/* Page heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ color: '#888', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              Start generating personalized podcasts for free
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: '#FFF5F5', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, padding: '11px 15px', marginBottom: 20, fontSize: '0.875rem', color: '#c53030', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ marginTop: 1 }}>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Field label="Full Name"     type="text"                          Icon={User} placeholder="Your full name"       value={form.name}     onChange={v => set('name', v)} />
            <Field label="Email Address" type="email"                         Icon={Mail} placeholder="you@example.com"      value={form.email}    onChange={v => set('email', v)} />
            <Field label="Password"      type={showPw ? 'text' : 'password'}  Icon={Lock} placeholder="Minimum 8 characters" value={form.password} onChange={v => set('password', v)} extra={{ paddingRight: 42 }} showToggle showPw={showPw} onTogglePw={() => setShowPw(s => !s)} />

            {/* Confirm password */}
            <div style={{ marginBottom: 26 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: '#4A4845', marginBottom: 7, letterSpacing: '0.01em' }}>
                <Lock size={13} color="#0B5D48" /> Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#C0BAB0', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  required
                  placeholder="Repeat your password"
                  style={{ width: '100%', background: '#fff', border: '1.5px solid #E8E1D7', borderRadius: 9, padding: '11px 14px 11px 40px', color: '#2B2A27', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.18s, box-shadow 0.18s' }}
                  onFocus={e => { e.target.style.borderColor = '#E85D2A'; e.target.style.boxShadow = '0 0 0 3px rgba(232,93,42,0.1)' }}
                  onBlur={e =>  { e.target.style.borderColor = '#E8E1D7'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? '#E8A33D' : '#E85D2A', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(232,93,42,0.3)', transition: 'background 0.18s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#C44D20' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#E85D2A' }}
            >
              {loading
                ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</>
                : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#888', fontSize: '0.875rem', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#E85D2A', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
