import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Plus, Play, Clock, Headphones, BarChart2, Search, ArrowRight } from 'lucide-react'
import AppLayout from '../components/AppLayout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { fetchUserPodcasts } from '../services/podcastService.js'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [podcasts, setPodcasts] = useState([])
  useEffect(() => { fetchUserPodcasts().then(setPodcasts).catch(() => setPodcasts([])) }, [])
  const firstName = user?.name?.split(' ')[0] || 'there'
  const initials  = user?.name?.slice(0, 2).toUpperCase() || 'VX'

  const continueListening = podcasts[0]

  return (
    <AppLayout>

      {/* ── Top bar ─────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EDE8DF', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div>
          <span style={{ fontWeight: 700, color: '#2B2A27', fontSize: '1rem' }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/my-podcasts')} aria-label="Search your podcasts" style={{ width: 36, height: 36, background: 'transparent', border: '1px solid #EDE8DF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F4EFE5'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          ><Search size={16} /></button>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#E85D2A,#C44D20)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', flexShrink: 0 }}>
            {initials}
          </div>
        </div>
      </div>

      {/* ── Page body ───────────────────────────────── */}
      <div style={{ padding: '28px 28px 48px', maxWidth: 900, fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p style={{ color: '#888', fontSize: '0.9375rem' }}>What would you like to explore today?</p>
        </div>

        {/* ── Create Podcast Banner ─────────────────── */}
        <div style={{ background: 'linear-gradient(130deg,#E85D2A 0%,#C04420 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, position: 'relative', overflow: 'hidden' }}>
          {/* decorative blobs */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 100, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>AI-POWERED</p>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.2 }}>
              Create a New Podcast
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: 18, lineHeight: 1.55, maxWidth: 340 }}>
              Turn a topic into a personalized AI podcast.
            </p>
            <Link to="/generate"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#E85D2A', padding: '9px 18px', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', transition: 'transform 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Plus size={15} /> Create Podcast
            </Link>
          </div>
          <div style={{ position: 'relative', zIndex: 1, fontSize: 60, flexShrink: 0, lineHeight: 1 }}>🎙️</div>
        </div>

        {/* ── Two-column row ────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>

          {/* Continue Listening */}
          <div style={{ background: '#fff', border: '1px solid #EDE8DF', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.9375rem', margin: 0 }}>Continue Listening</h3>
              <Link to="/my-podcasts" style={{ color: '#E85D2A', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Artwork */}
              {continueListening ? <>
              <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#0B5D48,#E85D2A)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                🎧
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                  {continueListening.title}
                </div>
                <div style={{ color: '#999', fontSize: '0.775rem', marginBottom: 10 }}>
                  {continueListening.duration_requested} min · {continueListening.style}
                </div>
                <div style={{ color: '#999', fontSize: '0.75rem', textTransform: 'capitalize' }}>{continueListening.status}</div>
              </div>
              <button onClick={() => navigate(`/podcast/${continueListening.id}`)}
                style={{ width: 40, height: 40, background: '#E85D2A', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 10px rgba(232,93,42,0.35)', transition: 'background 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#C44D20'}
                onMouseLeave={e => e.currentTarget.style.background = '#E85D2A'}
              >
                <Play size={15} color="#fff" style={{ marginLeft: 2 }} />
              </button></> : <p style={{ color: '#888', fontSize: '0.85rem' }}>Your generated podcasts will appear here.</p>}
            </div>
          </div>

          {/* Activity Stats */}
          <div style={{ background: '#fff', border: '1px solid #EDE8DF', borderRadius: 14, padding: '20px 22px' }}>
            <h3 style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.9375rem', marginBottom: 16 }}>Your Activity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { icon: Headphones, value: podcasts.length, label: 'Podcasts\nCreated', bg: '#FFF3EE', iconColor: '#E85D2A' },
                { icon: Clock, value: `${Math.round(podcasts.reduce((sum, p) => sum + (p.duration_actual || 0), 0) / 60 * 10) / 10}h`, label: 'Hours\nGenerated', bg: '#F0FAF4', iconColor: '#0B5D48' },
                { icon: BarChart2, value: new Set(podcasts.map(p => p.topic)).size, label: 'Topics\nExplored', bg: '#FFFAEE', iconColor: '#E8A33D' },
              ].map(({ icon: Icon, value, label, bg, iconColor }) => (
                <div key={label} style={{ background: bg, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <Icon size={18} color={iconColor} />
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 4, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Podcasts list ───────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.9375rem', margin: 0 }}>Recently Generated</h3>
            <Link to="/my-podcasts" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#E85D2A', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid #EDE8DF', borderRadius: 14, overflow: 'hidden' }}>
            {podcasts.slice(0, 4).map((pod, idx) => (
              <div key={pod.id}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: idx < 3 ? '1px solid #F4EFE5' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() => navigate(`/podcast/${pod.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 46, height: 46, background: 'linear-gradient(135deg,#0B5D48,#E85D2A)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  🎧
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>{pod.title}</div>
                  <div style={{ fontSize: '0.775rem', color: '#999' }}>{pod.duration_requested} min · {pod.style} · {pod.status}</div>
                </div>
                <div style={{ width: 32, height: 32, background: '#FFF3EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Play size={13} color="#E85D2A" style={{ marginLeft: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
