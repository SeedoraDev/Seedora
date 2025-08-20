import './index.css'
import { useState } from 'react'
import Navbar from './components/navbar'
import Hero from './components/Hero'
import Footer from './components/footter'
import Auth from './components/Auth'

function App() {
  const [view, setView] = useState<'home' | 'login' | 'signup'>('home')

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col">
      <Navbar
        onLogin={() => setView('login')}
        onSignup={() => setView('signup')}
        onHome={() => setView('home')}
      />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        {view === 'home' && (
          <Hero onNotify={() => console.log('Notify clicked')} />
        )}
        {view === 'login' && (
          <Auth initialMode="login" />
        )}
        {view === 'signup' && (
          <Auth initialMode="signup" />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
