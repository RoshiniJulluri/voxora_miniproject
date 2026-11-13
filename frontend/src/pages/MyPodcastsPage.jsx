import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Play, Plus, Clock, Mic2, Trash2 } from 'lucide-react'
import AppLayout from '../components/AppLayout.jsx'
import { podcastStyles } from '../mock-data/podcasts.js'
import { fetchUserPodcasts, deletePodcast } from '../services/podcastService.js'

export default function MyPodcastsPage() {
  const navigate = useNavigate()
  const [query,  setQuery]  = useState('')
  const [filter, setFilter] = useState('all')
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchUserPodcasts().then(setPodcasts).catch(err => setError(err.message)).finally(() => setLoading(false)) }, [])

  const styleOptions = [
    { id: 'all', label: 'All Styles' },
    ...podcastStyles.map(s => ({ id: s.id, label: s.label })),
  ]

  const filtered = useMemo(() => podcasts.filter(p => {
    const matchSearch = !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.topic.toLowerCase().includes(query.toLowerCase())
    const matchFilter = filter === 'all' ||
      p.style.toLowerCase().replace(/[ -]/g, '') === filter.replace(/[ -]/g, '')
    return matchSearch && matchFilter
  }), [podcasts, query, filter])

  const removePodcast = async (event, id) => {
    event.stopPropagation()
    if (!window.confirm('Delete this podcast permanently?')) return
    try { await deletePodcast(id); setPodcasts(items => items.filter(item => item.id !== id)) }
    catch (err) { setError(err.message) }
  }

  return (
    <AppLayout>

      {/* Page header bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EDE8DF', padding: '18px 28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#2B2A27', letterSpacing: '-0.02em', marginBottom: 3 }}>My Podcasts</h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            {podcasts.length} podcast{podcasts.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <button onClick={() => navigate('/generate')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#E85D2A', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(232,93,42,0.3)', transition: 'background 0.18s', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = '#C44D20'}
          onMouseLeave={e => e.currentTarget.style.background = '#E85D2A'}
        >
          <Plus size={15} /> Create New
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px 48px', fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Search + Filter bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#BBB', pointerEvents: 'none' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search podcasts…"
              style={{ width: '100%', background: '#fff', border: '1.5px solid #DDD8CF', borderRadius: 9, padding: '10px 14px 10px 40px', color: '#2B2A27', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.18s, box-shadow 0.18s' }}
              onFocus={e => { e.target.style.borderColor = '#E85D2A'; e.target.style.boxShadow = '0 0 0 3px rgba(232,93,42,0.09)' }}
              onBlur={e =>  { e.target.style.borderColor = '#DDD8CF'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ background: '#fff', border: '1.5px solid #DDD8CF', borderRadius: 9, padding: '10px 36px 10px 13px', color: '#2B2A27', fontSize: '0.9375rem', outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', transition: 'border-color 0.18s', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              onFocus={e => e.target.style.borderColor = '#E85D2A'}
              onBlur={e =>  e.target.style.borderColor = '#DDD8CF'}
            >
              {styleOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Result summary */}
        {error && <p role="alert" style={{ color: '#b42318', marginBottom: 14 }}>{error}</p>}
        {loading && <p style={{ color: '#777', padding: 20 }}>Loading your podcasts…</p>}
        {query && (
          <p style={{ fontSize: '0.8125rem', color: '#888', marginBottom: 14 }}>
            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
          </p>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
            <h3 style={{ fontWeight: 700, color: '#2B2A27', fontSize: '1.1rem', marginBottom: 6 }}>No podcasts found</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 20 }}>Try a different search term or filter</p>
            <button onClick={() => { setQuery(''); setFilter('all') }}
              style={{ background: '#F4EFE5', border: '1.5px solid #E8E1D7', borderRadius: 9, padding: '9px 20px', fontSize: '0.875rem', fontWeight: 600, color: '#555', cursor: 'pointer', fontFamily: 'inherit' }}
            >Clear filters</button>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #EDE8DF', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(43,42,39,0.06)' }}>
            {filtered.map((pod, idx) => {
                const durationLabel = `${pod.duration_actual || pod.duration_requested || 0} min`
                const style = pod.style || 'Podcast'
                return (
              <div key={pod.id}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', borderBottom: idx < filtered.length - 1 ? '1px solid #F4EFE5' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() => navigate(`/podcast/${pod.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Artwork */}
                <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#0B5D48,#E85D2A)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  🎧
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#2B2A27', fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                    {pod.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888', fontSize: '0.8rem' }}>
                      <Mic2 size={12} color="#AAA" /> {style}
                    </span>
                    <span style={{ color: '#DDD8CF', fontSize: '0.8rem' }}>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888', fontSize: '0.8rem' }}>
                      <Clock size={12} color="#AAA" /> {durationLabel}
                    </span>
                    <span style={{ color: '#DDD8CF', fontSize: '0.8rem' }}>·</span>
                    <span style={{ color: '#AAA', fontSize: '0.775rem' }}>
                      {new Date(pod.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ color: pod.status === 'completed' ? '#0B5D48' : pod.status === 'failed' ? '#b42318' : '#9a5b00', fontSize: '0.75rem', textTransform: 'capitalize' }}>{pod.status.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Language badge (desktop only) */}
                <span style={{ background: '#FFF3EE', color: '#E85D2A', border: '1px solid rgba(232,93,42,0.2)', borderRadius: 99, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {pod.language}
                </span>

                {/* Play button */}
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/podcast/${pod.id}`) }}
                  style={{ width: 36, height: 36, background: '#FFF3EE', border: '1px solid rgba(232,93,42,0.2)', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E85D2A'; e.currentTarget.style.borderColor = '#E85D2A' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FFF3EE'; e.currentTarget.style.borderColor = 'rgba(232,93,42,0.2)' }}
                >
                  <Play size={13} color="#E85D2A" style={{ marginLeft: 1, transition: 'color 0.15s' }}
                    ref={el => {
                      if (el) {
                        const btn = el.closest('button')
                        btn.addEventListener('mouseenter', () => el.setAttribute('color', '#fff'))
                        btn.addEventListener('mouseleave', () => el.setAttribute('color', '#E85D2A'))
                      }
                    }}
                  />
                </button>

                {/* 3-dot */}
                <button onClick={e => removePodcast(e, pod.id)} aria-label={`Delete ${pod.title}`}
                  style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, color: '#BBB', transition: 'background 0.15s, color 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F4EFE5'; e.currentTarget.style.color = '#555' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#BBB' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
                )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
