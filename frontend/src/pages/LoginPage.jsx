import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Headphones, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'

/* ── Illustration (left panel) ─────────────────────────── */
function PodcastIllustration() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative' }}>
      {/* Background circles */}
      <div style={{ position: 'absolute', width: 280, height: 280, background: 'rgba(255,255,255,0.12)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: 350, height: 350, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />

      {/* Person SVG */}
      <svg width="240" height="300" viewBox="0 0 240 300" style={{ position: 'relative', zIndex: 1 }}>
        {/* Body / torso */}
        <ellipse cx="120" cy="260" rx="78" ry="50" fill="#C04A26" />
        {/* Orange jacket fold */}
        <ellipse cx="120" cy="230" rx="65" ry="38" fill="#D86030" />

        {/* Head */}
        <ellipse cx="120" cy="148" rx="52" ry="58" fill="#D4956A" />

        {/* Hair */}
        <ellipse cx="120" cy="118" rx="52" ry="32" fill="#2B1810" />
        <path d="M 68 148 Q 60 190 68 220" stroke="#2B1810" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M 172 148 Q 180 190 172 220" stroke="#2B1810" strokeWidth="22" fill="none" strokeLinecap="round" />

        {/* Headband */}
        <path d="M 68 138 Q 120 100 172 138" fill="none" stroke="#8B3A1C" strokeWidth="14" strokeLinecap="round" />

        {/* Left ear cup */}
        <ellipse cx="68" cy="152" rx="18" ry="22" fill="#C04A26" />
        <ellipse cx="68" cy="152" rx="12" ry="14" fill="#E06030" />

        {/* Right ear cup */}
        <ellipse cx="172" cy="152" rx="18" ry="22" fill="#C04A26" />
        <ellipse cx="172" cy="152" rx="12" ry="14" fill="#E06030" />

        {/* Eyes (closed, serene) */}
        <path d="M 103 158 Q 112 164 121 158" stroke="#6B3220" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 119 158 Q 128 164 137 158" stroke="#6B3220" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Smile */}
        <path d="M 107 178 Q 120 190 133 178" stroke="#6B3220" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Speech bubble with waveform */}
        <rect x="150" y="92" width="76" height="42" rx="10" fill="#FFFFFF" />
        <polygon points="158,134 148,144 165,134" fill="#FFFFFF" />
        {[160, 170, 180, 190, 200, 210, 218].map((x, i) => {
          const h = [7, 14, 20, 26, 18, 12, 8][i]
          return <rect key={x} x={x - 2} y={119 - h / 2} width="4" height={h} rx="2" fill="#E85D2A" opacity={0.85} />
        })}

        {/* Leaf decorations */}
        <ellipse cx="30" cy="280" rx="22" ry="12" fill="#7A9B57" opacity="0.6" transform="rotate(-30 30 280)" />
        <ellipse cx="20" cy="265" rx="18" ry="10" fill="#5A7540" opacity="0.5" transform="rotate(-15 20 265)" />
        <line x1="28" y1="275" x2="28" y2="300" stroke="#5A7540" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

        <ellipse cx="210" cy="275" rx="20" ry="10" fill="#7A9B57" opacity="0.5" transform="rotate(25 210 275)" />
        <ellipse cx="220" cy="260" rx="16" ry="9" fill="#5A7540" opacity="0.4" transform="rotate(10 220 260)" />
      </svg>

      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: 600, marginTop: 24, textAlign: 'center', lineHeight: 1.5 }}>
        "Your ideas, your voice,<br />your podcast."
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', marginTop: 8, textAlign: 'center' }}>
        AI-Powered · Personalized · Multilingual
      </p>
    </div>
  )
}

/* ── Login Page ────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { user } = await login(form)
      navigate(user.onboarded ? '/dashboard' : '/onboarding', { replace: true })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Left — illustration */}
      <div
        className="hidden lg:flex"
        style={{ width: '44%', flexShrink: 0, background: 'linear-gradient(145deg,#0B5D48 0%,#094A39 60%,#063328 100%)', flexDirection: 'column' }}
      >
        {/* Logo */}
        <div style={{ padding: '28px 32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={17} color="#E85D2A" />
            </div>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>VOXORA</span>
          </Link>
        </div>
        <div style={{ flex: 1 }}>
          <PodcastIllustration />
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, background: '#FAF7F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28 }}>
            <div style={{ width: 30, height: 30, background: '#0B5D48', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={15} color="#E85D2A" />
            </div>
            <span style={{ fontWeight: 800, color: '#2B2A27', fontSize: '1rem' }}>VOXORA</span>
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', marginBottom: 6 }}>
              Welcome Back! 👋
            </h1>
            <p style={{ color: '#777', fontSize: '0.9375rem' }}>Sign in to continue to VOXORA</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FFF5F5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: '0.875rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label"><Mail size={13} />Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#AAA' }} />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="you@example.com" className="input-icon" />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="label"><Lock size={13} />Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#AAA' }} />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required placeholder="••••••••" className="input-icon" style={{ paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', display: 'flex' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: '0.875rem', color: '#555' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: '#E85D2A', width: 15, height: 15 }} />
                Remember me
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: 10, justifyContent: 'center' }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</> : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#777', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#E85D2A', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
