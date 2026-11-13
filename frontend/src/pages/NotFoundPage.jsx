import { Link } from 'react-router-dom'
import { Headphones, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 48 }}>
        <div style={{ width: 36, height: 36, background: '#0B5D48', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Headphones size={18} color="#E85D2A" />
        </div>
        <span style={{ fontWeight: 800, color: '#2B2A27', fontSize: '1.1rem' }}>VOXORA</span>
      </div>

      {/* 404 visual */}
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎙️</div>
      <h1 style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', fontWeight: 900, color: '#0B5D48', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#2B2A27', marginBottom: 12, letterSpacing: '-0.01em' }}>Page not found</h2>
      <p style={{ color: '#888', fontSize: '0.9375rem', maxWidth: 360, lineHeight: 1.65, marginBottom: 36 }}>
        Looks like this frequency doesn't exist. Let's get you back on air.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#E85D2A', color: '#fff', padding: '11px 22px', borderRadius: 9, fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 3px 12px rgba(232,93,42,0.3)', transition: 'background 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#C44D20'}
          onMouseLeave={e => e.currentTarget.style.background = '#E85D2A'}
        >
          <Home size={16} /> Go Home
        </Link>
        <button onClick={() => window.history.back()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#2B2A27', border: '1.5px solid #E8E1D7', padding: '11px 22px', borderRadius: 9, fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.18s, border-color 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F4EFE5'; e.currentTarget.style.borderColor = '#C5BBA8' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E8E1D7' }}
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  )
}
