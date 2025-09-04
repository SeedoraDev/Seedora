import { useEffect } from 'react'

export default function AuthSuccess() {

  useEffect(() => {
    // Get token from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Redirect to dashboard or home
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } else {
      // No token found, redirect to auth page
      window.location.href = '/auth?error=no_token'
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-medium text-white mb-2">Authentication Successful</h2>
        <p className="text-white/60">Redirecting you to the dashboard...</p>
      </div>
    </div>
  )
}
