import { createContext, useContext, useState, useEffect } from 'react'
import { login as authLogin, register as authRegister, logout as authLogout, getMe } from '../services/authService.js'
import { savePreferences } from '../services/podcastService.js'

// ── Context ───────────────────────────────────────────────
const AuthContext = createContext(null)

// ── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('voxora_token')
    if (!token) { setLoading(false); return }
    getMe().then((restored) => {
      setUser(restored)
      localStorage.setItem('voxora_user', JSON.stringify(restored))
    }).catch(() => {
      localStorage.removeItem('voxora_token')
      localStorage.removeItem('voxora_user')
    }).finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const data = await authLogin(credentials)
    setUser(data.user)
    localStorage.setItem('voxora_user', JSON.stringify(data.user))
    return data
  }

  const register = async (payload) => {
    const data = await authRegister(payload)
    setUser(data.user)
    localStorage.setItem('voxora_user', JSON.stringify(data.user))
    return data
  }

  const logout = async () => {
    await authLogout()
    setUser(null)
    localStorage.removeItem('voxora_user')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('voxora_user', JSON.stringify(updated))
  }

  const updatePreferences = async (preferences) => {
    const saved = await savePreferences(preferences)
    const updated = { ...user, ...saved, onboarded: true }
    setUser(updated)
    localStorage.setItem('voxora_user', JSON.stringify(updated))
    return updated
  }

  const refreshUser = async () => {
    const fresh = await getMe()
    setUser(fresh)
    localStorage.setItem('voxora_user', JSON.stringify(fresh))
    return fresh
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, updatePreferences, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
