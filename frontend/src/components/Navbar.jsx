/**
 * UNUSED – This component is not imported by any page or layout.
 * It is a leftover from an earlier design iteration and uses CSS
 * class names (glass, gradient-text, container-app) that are not
 * defined in index.css. Do not import this file.
 *
 * Safe to delete once confirmed no longer needed.
 */
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Mic2, LayoutDashboard, PlusCircle, LogOut, Menu, X, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate',  label: 'Generate',  icon: PlusCircle },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const { pathname }      = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-surface-border">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/40 transition-shadow">
              <Mic2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">VOXORA</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`btn-ghost ${pathname === to ? 'text-white bg-surface-card' : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-300 font-medium">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-ghost text-gray-500 hover:text-red-400">
              <LogOut size={16} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden btn-ghost"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface-card px-4 py-4 flex flex-col gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`btn-ghost justify-start ${pathname === to ? 'text-white bg-surface' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <div className="border-t border-surface-border mt-2 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-ghost text-red-400 text-xs">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
