import { useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { knowledgeLevels, podcastStyles, supportedLanguages, userCategories } from '../mock-data/podcasts.js'

export default function SettingsPage() {
  const { user, updatePreferences } = useAuth()
  const [form, setForm] = useState({
    category: user?.category || 'general',
    knowledge_level: user?.knowledge_level || 'beginner',
    preferred_language: user?.preferred_language || 'en',
    preferred_style: user?.preferred_style || 'conversational',
    preferred_voice: user?.preferred_voice || '',
    interests: (user?.interests || []).join(', '),
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const field = (label, key, options) => (
    <label className="label" style={{ display: 'block', marginBottom: 18 }}>
      {label}
      <select className="select" value={form[key]} onChange={e => setForm(current => ({ ...current, [key]: e.target.value }))} style={{ display: 'block', marginTop: 7 }}>
        {options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
    </label>
  )

  const submit = async event => {
    event.preventDefault(); setSaving(true); setMessage(''); setError('')
    try {
      await updatePreferences({ ...form, preferred_voice: form.preferred_voice || null, interests: form.interests.split(',').map(value => value.trim()).filter(Boolean) })
      setMessage('Preferences saved.')
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return <AppLayout>
    <div style={{ background: '#fff', borderBottom: '1px solid #EDE8DF', padding: '18px 28px' }}>
      <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#2B2A27' }}>Settings</h1>
      <p style={{ color: '#888', fontSize: '0.875rem', marginTop: 4 }}>Manage your learning and podcast preferences.</p>
    </div>
    <div style={{ padding: 28, maxWidth: 700 }}>
      <form onSubmit={submit} className="card">
        {field('About you', 'category', userCategories)}
        {field('Knowledge level', 'knowledge_level', knowledgeLevels)}
        {field('Preferred style', 'preferred_style', podcastStyles)}
        {field('Language', 'preferred_language', supportedLanguages)}
        <label className="label" style={{ display: 'block', marginBottom: 18 }}>Interests (comma separated)
          <input className="input" value={form.interests} onChange={e => setForm(current => ({ ...current, interests: e.target.value }))} style={{ display: 'block', marginTop: 7 }} />
        </label>
        <label className="label" style={{ display: 'block', marginBottom: 18 }}>Murf voice ID
          <input className="input" value={form.preferred_voice} onChange={e => setForm(current => ({ ...current, preferred_voice: e.target.value }))} placeholder="Optional provider voice ID" style={{ display: 'block', marginTop: 7 }} />
        </label>
        {message && <p role="status" style={{ color: '#0B5D48', marginBottom: 14 }}>{message}</p>}
        {error && <p role="alert" style={{ color: '#b42318', marginBottom: 14 }}>{error}</p>}
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save preferences'}</button>
      </form>
    </div>
  </AppLayout>
}
