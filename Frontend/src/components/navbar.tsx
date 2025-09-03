import { useState } from 'react'

interface NavbarProps {
  user?: any
  onLogin: () => void
  onSignup: () => void
  onHome?: () => void
  onUpload?: () => void
  onLogout?: () => void
}

export default function Navbar({ user, onLogin, onSignup, onHome, onUpload, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="w-full border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <button
          onClick={onHome}
          className="text-lg font-light tracking-wide text-white hover:text-white/80 transition-colors"
          aria-label="Go to Seedora home"
        >
          Seedora
        </button>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onUpload}
            className="flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm hover:bg-gray-100 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Analyze
          </button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm text-white/80 hidden sm:block">
                  {user.username || user.email}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="rounded-full bg-white text-black px-4 py-2 text-sm hover:bg-gray-100 transition-all duration-300"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center group"
          aria-label="Toggle mobile menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
          }`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
          }`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
          }`}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`} onClick={closeMobileMenu}></div>

      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 transform transition-all duration-300 ease-in-out origin-top ${
        isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
      }`}>
        <div className="flex flex-col p-4 space-y-4 max-w-7xl mx-auto">
          {/* Analyze Button */}
          <button
            onClick={() => {
              onUpload?.()
              closeMobileMenu()
            }}
            className="flex items-center gap-3 rounded-xl bg-white text-black px-4 py-3 text-sm hover:bg-gray-100 transition-all duration-300 w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Analyze
          </button>

          {user ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">
                  {user.username || user.email}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onLogout?.()
                  closeMobileMenu()
                }}
                className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              {/* Login Button */}
              <button
                onClick={() => {
                  onLogin()
                  closeMobileMenu()
                }}
                className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-sm text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Login
              </button>

              {/* Sign up Button */}
              <button
                onClick={() => {
                  onSignup()
                  closeMobileMenu()
                }}
                className="flex-1 rounded-xl bg-white text-black px-4 py-3 text-sm hover:bg-gray-100 transition-all duration-300"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}