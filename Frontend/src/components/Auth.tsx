import { useEffect, useState } from 'react'

type AuthProps = {
  initialMode?: 'login' | 'signup'
}

export default function Auth({ initialMode = 'login' }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  async function handleAuthApi(endpoint: string, body: any) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Authentication failed')
      // Store JWT
      if (remember) {
        localStorage.setItem('token', data.token)
      } else {
        sessionStorage.setItem('token', data.token)
      }
      // Optionally: trigger parent to update auth state
      window.location.reload() // crude, but works for now
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'login') {
      handleAuthApi('login', { email, password })
    } else {
      handleAuthApi('register', { username: fullName, email, password })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Enhanced Tab Switcher */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex rounded-full p-1 bg-white/10 border border-white/20 backdrop-blur-sm">
          <button
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              mode === 'login' 
                ? 'bg-white text-black shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              mode === 'signup' 
                ? 'bg-white text-black shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Enhanced Auth Card */}
      <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-sm p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-white mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-white/60 text-sm">
            {mode === 'login' 
              ? 'Sign in to access your ThermoFoot dashboard' 
              : 'Join Seedora to start analyzing thermograms'
            }
          </p>
        </div>

        {/* Google Auth Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 px-4 py-3 text-white font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-black px-4 text-sm text-white/50">or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 outline-none px-4 py-3 text-white placeholder-white/40 transition-all duration-200"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Email address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 outline-none px-4 py-3 text-white placeholder-white/40 transition-all duration-200"
              autoComplete="email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Password</label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full rounded-xl bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 outline-none px-4 py-3 pr-12 text-white placeholder-white/40 transition-all duration-200"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-4 text-white/60 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-white/70">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors" 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}


