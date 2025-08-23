import './index.css'
import { useEffect, useState } from 'react'
import Navbar from './components/navbar'
import Hero from './components/Hero'
import Footer from './components/footter'
import Auth from './components/Auth'

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

function App() {
  const [view, setView] = useState<'home' | 'login' | 'signup'>('home')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/me`, {
      headers: { 'x-auth-token': token },
    })
      .then(async (res) => {
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
    <div className="min-h-screen w-screen bg-black text-white flex flex-col">
      <Navbar
        user={user}
        onLogin={() => setView('login')}
        onSignup={() => setView('signup')}
        onHome={() => setView('home')}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        {user ? (
          <Hero onNotify={() => console.log('Notify clicked')} />
        ) : view === 'login' ? (
          <Auth initialMode="login" />
        ) : view === 'signup' ? (
          <Auth initialMode="signup" />
        ) : (
          <Hero onNotify={() => console.log('Notify clicked')} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
