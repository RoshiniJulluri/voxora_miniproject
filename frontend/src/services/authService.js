import { apiClient } from './apiClient.js'

const normalizeUser = (user) => ({ ...user, name: user.full_name || user.name, onboarded: Boolean(user.onboarding_complete) })

async function saveSession(data) {
  localStorage.setItem('voxora_token', data.access_token)
  try {
    const [user, preferences] = await Promise.all([
      apiClient.get('/auth/me'),
      apiClient.get('/preferences').catch(() => null),
    ])
    return { user: normalizeUser({ ...user, ...(preferences || {}) }) }
  } catch (error) {
    localStorage.removeItem('voxora_token')
    throw error
  }
}

export async function login({ email, password }) {
  return saveSession(await apiClient.post('/auth/login', { email, password }))
}

export async function register({ name, email, password }) {
  return saveSession(await apiClient.post('/auth/register', { full_name: name, email, password }))
}

export async function logout() {
  try { await apiClient.post('/auth/logout', {}) } finally { localStorage.removeItem('voxora_token') }
}

export async function getMe() {
  const user = await apiClient.get('/auth/me')
  const preferences = await apiClient.get('/preferences').catch(() => null)
  return normalizeUser({ ...user, ...(preferences || {}) })
}
