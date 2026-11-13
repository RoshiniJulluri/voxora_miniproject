import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Mic2, Headphones, Compass, Settings, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'

const NAV = [
  { to: '/dashboard',   label: 'Home',           icon: Home },
  { to: '/generate',    label: 'Create Podcast', icon: Mic2 },
  { to: '/my-podcasts', label: 'My Podcasts',    icon: Headphones },
  { to: '/explore',     label: 'Explore',        icon: Compass },
  { to: '/settings',    label: 'Settings',       icon: Settings },
]

const SIDEBAR_W = 236

function SidebarContent({ onLinkClick }) {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()
  const navigate         = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <Link to="/dashboard" onClick={onLinkClick}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Headphones size={17} color="#E85D2A" />
          </div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>VOXORA</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/dashboard' && pathname.startsWith(to))
          return (
            <Link key={to} to={to} onClick={onLinkClick}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 9, marginBottom: 2,
                textDecoration: 'none',
                background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: '#fff',
                fontWeight: active ? 600 : 400,
                fontSize: '0.9375rem',
                opacity: active ? 1 : 0.68,
                transition: 'background 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.opacity = '1' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.68' } }}
            >
              <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: active ? '#E85D2A' : 'rgba(255,255,255,0.08)', transition: 'background 0.15s' }}>
                <Icon size={15} />
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '14px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#E85D2A,#C44D20)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
            {user?.name?.slice(0, 2).toUpperCase() || 'VP'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Vishwasri'}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', textTransform: 'capitalize' }}>{user?.category || 'Student'}</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 6, transition: 'color 0.15s, background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  /* Close mobile menu on route change */
  const { pathname } = useLocation()
  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      {/* ── Global layout CSS injected once ─────────── */}
      <style>{`
        .vox-sidebar {
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: ${SIDEBAR_W}px;
          background: #0B5D48;
          z-index: 40;
          box-shadow: 2px 0 16px rgba(0,0,0,0.14);
        }
        .vox-topbar { display: none; }
        .vox-main {
          margin-left: ${SIDEBAR_W}px;
          min-height: 100vh;
          background: #FAF7F0;
        }
        @media (max-width: 767px) {
          .vox-sidebar { display: none; }
          .vox-topbar {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #0B5D48;
            padding: 12px 16px;
            position: sticky;
            top: 0;
            z-index: 30;
          }
          .vox-main { margin-left: 0; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#FAF7F0' }}>

        {/* ── Desktop sidebar ────────────────────────── */}
        <aside className="vox-sidebar">
          <SidebarContent onLinkClick={undefined} />
        </aside>

        {/* ── Mobile overlay ─────────────────────────── */}
        {mobileOpen && (
          <>
            <div onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }} />
            <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: SIDEBAR_W, background: '#0B5D48', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => setMobileOpen(false)}
                style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 7 }}>
                <X size={16} />
              </button>
              <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </aside>
          </>
        )}

        {/* ── Main area ──────────────────────────────── */}
        <div className="vox-main">
          {/* Mobile top bar */}
          <div className="vox-topbar">
            <button onClick={() => setMobileOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <Menu size={22} />
            </button>
            <Headphones size={18} color="#E85D2A" />
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>VOXORA</span>
          </div>

          {children}
        </div>
      </div>
    </>
  )
}
