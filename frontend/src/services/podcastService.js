import { apiClient } from './apiClient.js'

export const generatePodcast = (params) => apiClient.post('/podcasts/generate', params)
export const fetchUserPodcasts = () => apiClient.get('/podcasts')
export const fetchPodcastById = (id) => apiClient.get(`/podcasts/${id}`)
export const fetchPodcastAudio = (id) => apiClient.blob(`/podcasts/${id}/audio`)
export const fetchPodcastStatus = (id) => apiClient.get(`/podcasts/${id}/status`)
export const deletePodcast = (id) => apiClient.delete(`/podcasts/${id}`)
export const retryPodcast = (id) => apiClient.post(`/podcasts/${id}/retry`, {})
export const savePreferences = (preferences) => apiClient.put('/preferences', preferences)
export const fetchProviderStatus = () => apiClient.get('/providers/status')
export const fetchProviderVoices = () => apiClient.get('/providers/voices')

export async function submitQuizAnswers(podcastId, answers) {
  return apiClient.post(`/podcasts/${podcastId}/quiz/submit`, { answers })
}
