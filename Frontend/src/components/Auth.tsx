import { useEffect, useState } from 'react'
import GoogleAuth from './GoogleAuth'

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

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder submit handler
    if (mode === 'login') {
      console.log('Login with', { email, password })
    } else {
      console.log('Signup with', { fullName, email, password })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 flex items-center justify-center">
        <div className="flex rounded-full p-0.5 bg-white/10 border border-white/10">
          <button
            className={`px-3 py-1.5 text-xs md:text-sm rounded-full transition-colors ${
              mode === 'login' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`px-3 py-1.5 text-xs md:text-sm rounded-full transition-colors ${
              mode === 'signup' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <h2 className="text-sm md:text-base tracking-wide mb-3">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <div className="mb-3">
          <GoogleAuth
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
            text={mode === 'login' ? 'signin_with' : 'signup_with'}
            onCredential={(jwt) => console.log('Google JWT', jwt)}
          />
        </div>
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-2 text-xs text-white/50">or</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-xs text-white/70">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Jane Doe"
                className="w-full rounded-lg bg-transparent border border-white/20 focus:border-white/40 outline-none px-3 py-2 text-sm"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-xs text-white/70">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-transparent border border-white/20 focus:border-white/40 outline-none px-3 py-2 text-sm"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-white/70">Password</label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-lg bg-transparent border border-white/20 focus:border-white/40 outline-none px-3 py-2 text-sm pr-10"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-xs text-white/60 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 accent-white/90"
              />
              <span className="text-white/70">Remember me</span>
            </label>
            <button type="button" className="text-white/70 hover:text-white underline underline-offset-2">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-3xl bg-white text-black px-4 py-2 text-sm hover:bg-white/90 active:bg-white transition-colors"
          >
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        {mode === 'login' ? (
          <p className="mt-3 text-xs text-white/60">
            New here?{' '}
            <button className="underline hover:text-white" onClick={() => setMode('signup')}>
              Create an account
            </button>
          </p>
        ) : (
          <p className="mt-3 text-xs text-white/60">
            Already have an account?{' '}
            <button className="underline hover:text-white" onClick={() => setMode('login')}>
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}


