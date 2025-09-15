import './index.css'
import { useEffect, useState } from 'react'
import Navbar from './components/navbar'
import LandingPage from './components/LandingPage'
import UploadPage from './components/UploadPage'
import Footer from './components/footter'
import Auth from './components/Auth'
import AuthSuccess from './components/AuthSuccess'
import AnimatedBackground from './components/AnimatedBackground'
import BackgroundAnalysis from './components/BackgroundAnalysis'
import { AnalysisProvider } from './contexts/AnalysisContext'

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

function App() {
  const [view, setView] = useState<'home' | 'upload' | 'login' | 'signup' | 'auth-success'>('home')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we're on the auth success route
    if (window.location.pathname === '/auth/success') {
      setView('auth-success')
      setLoading(false)
      return
    }

    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setUser(null)
    }, 5000)
    
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/me`, {
      headers: { 'x-auth-token': token },
    })
      .then(async (res) => {
        clearTimeout(timeoutId)
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setUser(null)
    setView('login')
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <AnalysisProvider>
      <div className={`w-screen bg-black text-white flex flex-col ${view === 'login' || view === 'signup' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
        <Navbar
          user={user}
          onLogin={() => setView('login')}
          onSignup={() => setView('signup')}
          onHome={() => setView('home')}
          onUpload={() => setView('upload')}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          {view === 'upload' ? (
            <UploadPage onBack={() => setView('home')} />
          ) : view === 'login' ? (
            <div className="relative flex items-center justify-center h-full overflow-hidden px-4 sm:px-6 py-8">
              <AnimatedBackground />
              <div className="relative z-10">
                <Auth initialMode="login" />
              </div>
            </div>
          ) : view === 'signup' ? (
            <div className="relative flex items-center justify-center h-full overflow-hidden px-4 sm:px-6 py-8">
              <AnimatedBackground />
              <div className="relative z-10">
                <Auth initialMode="signup" />
              </div>
            </div>
          ) : view === 'auth-success' ? (
            <AuthSuccess />
          ) : (
            <LandingPage onGetStarted={() => setView('upload')} />
          )}
        </main>
        <Footer />
        <BackgroundAnalysis currentView={view} />
      </div>
    </AnalysisProvider>
  )
}

export default App
