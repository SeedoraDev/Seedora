import { useState } from 'react'

type AuthProps = {
  initialMode?: 'login' | 'signup'
  onBack: () => void
}

export default function Auth({ initialMode = 'login', onBack }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [hospitalName, setHospitalName] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login'
        ? { email, password }
        : { username: fullName, email, password, doctorName, hospitalName, doctorId }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        window.location.href = '/'
      } else {
        setError(data.msg || data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-white/50 text-sm">
              {mode === 'login' ? 'Sign in to continue to Seedora' : 'Create your account to get started'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-medium rounded-3xl transition-all duration-200 ${mode === 'login'
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 text-sm font-medium rounded-3xl transition-all duration-200 ${mode === 'signup'
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              Sign up
            </button>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => window.location.href = `${API_URL}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 rounded-3xl bg-white hover:bg-gray-100 transition-all duration-200 px-4 py-3.5 text-gray-900 text-sm font-medium mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/5 text-white/40">OR CONTINUE WITH EMAIL</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-white/70">Full Name</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-3xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder-white/30 text-sm transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/70">Doctor Name</label>
                  <input
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    type="text"
                    placeholder="Enter doctor name"
                    className="w-full rounded-3xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder-white/30 text-sm transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/70">Hospital Name</label>
                  <input
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    type="text"
                    placeholder="Enter hospital name"
                    className="w-full rounded-3xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder-white/30 text-sm transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/70">Doctor ID</label>
                  <input
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    type="text"
                    placeholder="Enter doctor ID"
                    className="w-full rounded-3xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder-white/30 text-sm transition-all duration-200"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm text-white/70">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-3xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder-white/30 text-sm transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/70">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-3xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/[0.07] outline-none px-4 py-3 text-white placeholder-white/30 text-sm transition-all duration-200"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-white hover:bg-gray-100 disabled:bg-white/50 disabled:cursor-not-allowed transition-all duration-200 px-4 py-3.5 text-black text-sm font-medium mt-6"
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
                <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/40">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-white/70 hover:text-white font-medium transition-colors underline underline-offset-2"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
