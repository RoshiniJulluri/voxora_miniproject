const API_ORIGIN = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
const BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api/v1` : '/api/v1'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('voxora_token')
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  let response
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
  } catch {
    throw new Error('Unable to reach the VOXORA API. Check that the backend is running.')
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const detail = errorData.detail || errorData.message
    const message = Array.isArray(detail) ? detail.map(item => item.msg).filter(Boolean).join(' ') : detail
    throw new Error(typeof message === 'string' ? message : `Request failed (${response.status}).`)
  }
  if (response.status === 204) return null
  return response.json()
}

export const apiClient = {
  get: (endpoint, opts = {}) => request(endpoint, { method: 'GET', ...opts }),
  post: (endpoint, body, opts = {}) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...opts }),
  put: (endpoint, body, opts = {}) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...opts }),
  delete: (endpoint, opts = {}) => request(endpoint, { method: 'DELETE', ...opts }),
  async blob(endpoint) {
    const token = localStorage.getItem('voxora_token')
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!response.ok) throw new Error('Unable to load the podcast audio.')
    return response.blob()
  },
}
