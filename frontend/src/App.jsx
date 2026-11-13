import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'

import LandingPage      from './pages/LandingPage.jsx'
import LoginPage        from './pages/LoginPage.jsx'
import RegisterPage     from './pages/RegisterPage.jsx'
import DashboardPage    from './pages/DashboardPage.jsx'
import OnboardingPage   from './pages/OnboardingPage.jsx'
import GeneratePage     from './pages/GeneratePage.jsx'
import PodcastPage      from './pages/PodcastPage.jsx'
import MyPodcastsPage   from './pages/MyPodcastsPage.jsx'
import NotFoundPage     from './pages/NotFoundPage.jsx'
import SettingsPage     from './pages/SettingsPage.jsx'
import ProtectedRoute   from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/onboarding"  element={<OnboardingPage />} />
            <Route path="/generate"    element={<GeneratePage />} />
            <Route path="/podcast/:id" element={<PodcastPage />} />
            <Route path="/my-podcasts" element={<MyPodcastsPage />} />
            <Route path="/explore"     element={<Navigate to="/my-podcasts" replace />} />
            <Route path="/settings"    element={<SettingsPage />} />
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*"    element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
