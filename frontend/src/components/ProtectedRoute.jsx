import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

/**
 * Wraps protected routes.
 * Redirects unauthenticated users to /login.
 * Shows a spinner while auth state is being rehydrated.
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm">Loading VOXORA…</p>
        </div>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
