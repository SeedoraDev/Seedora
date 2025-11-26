import { useState, useEffect } from 'react'

interface DeveloperPortalProps {
  onBack: () => void
}

interface APIKey {
  _id: string
  name: string
  keyPrefix: string
  createdAt: string
  lastUsed: string | null
  totalCalls: number
  isActive: boolean
}

interface UsageStats {
  today: number
  thisWeek: number
  thisMonth: number
  rateLimit: {
    hourly: { used: number; total: number; remaining: number }
    daily: { used: number; total: number; remaining: number }
  }
}

export default function DeveloperPortal({ onBack }: DeveloperPortalProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  // Load API keys and stats from backend on mount
  useEffect(() => {
    fetchKeys()
    fetchStats()
  }, [])

  const fetchKeys = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/developer/keys`, {
        headers: { 'x-auth-token': token }
      })

      if (response.ok) {
        const data = await response.json()
        setApiKeys(data)
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/developer/stats`, {
        headers: { 'x-auth-token': token }
      })

      if (response.ok) {
        const data = await response.json()
        setUsageStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return

    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/developer/keys/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ name: newKeyName })
      })

      if (response.ok) {
        const data = await response.json()
        setNewlyCreatedKey(data.key)
        setNewKeyName('')
        setShowNewKeyModal(false)
        fetchKeys() // Reload keys list
      }
    } catch (error) {
      console.error('Failed to create API key:', error)
    }
  }

  const handleDeleteKey = async (id: string) => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/developer/keys/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      })

      if (response.ok) {
        setDeleteConfirmId(null)
        fetchKeys() // Reload keys list
      }
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskKey = (keyPrefix: string) => {
    return keyPrefix + '••••••••••••••••••••••••'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-5">
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white transition-colors mb-5 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          <div className="border-l-2 border-white pl-6">
            <h1 className="text-3xl font-light text-white mb-2">
              API <span className="font-normal">Developer Portal</span>
            </h1>
            <p className="text-white/60 text-sm">
              Build powerful integrations with Seedora's DFU prediction API
            </p>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium text-white">API Keys</h2>
            <button
              onClick={() => setShowNewKeyModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-2xl text-sm font-medium hover:bg-gray-100 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate New Key
            </button>
          </div>

          {apiKeys.length === 0 ? (
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-10 text-center">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No API Keys Yet</h3>
              <p className="text-white/60 text-sm mb-5">Generate your first API key to start integrating with Seedora</p>
              <button
                onClick={() => setShowNewKeyModal(true)}
                className="px-5 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors"
              >
                Create API Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey._id} className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5 hover:from-white/[0.1] hover:to-white/[0.04] transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-white mb-2">{apiKey.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <code className="text-sm text-white/80 font-mono bg-black/40 px-3 py-1.5 rounded-lg">
                          {maskKey(apiKey.keyPrefix)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(apiKey.keyPrefix)}
                          className="p-1.5 text-white/60 hover:text-white transition-colors"
                          title="Copy prefix"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(apiKey._id)}
                          className="p-1.5 text-white/60 hover:text-red-400 transition-colors"
                          title="Delete key"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/50">
                        <span>Created: {formatDate(apiKey.createdAt)}</span>
                        <span>•</span>
                        <span>Last used: {getTimeAgo(apiKey.lastUsed)}</span>
                        <span>•</span>
                        <span>{apiKey.totalCalls.toLocaleString()} calls</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirmId === apiKey._id && (
                    <div className="mt-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-sm text-red-400 mb-3">Are you sure you want to delete this API key? This action cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteKey(apiKey._id)}
                          className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-4 py-1.5 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Start Section */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-white mb-5">Quick Start</h2>
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
            <p className="text-white/70 mb-4 text-sm">Make your first API call in seconds:</p>
            <div className="bg-black/60 rounded-xl p-4 mb-4 relative group">
              <button
                onClick={() => copyToClipboard(`curl -X POST https://api.seedora.com/v1/predict \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@foot_thermogram.png"`)}
                className="absolute top-3 right-3 p-2 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy code"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <pre className="text-sm text-white/90 font-mono overflow-x-auto">
                {`curl -X POST https://api.seedora.com/v1/predict \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@foot_thermogram.png"`}
              </pre>
            </div>
            <button className="px-5 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors">
              View Full Documentation →
            </button>
          </div>
        </div>

        {/* Usage Statistics */}
        <div>
          <h2 className="text-xl font-medium text-white mb-5">Usage Statistics</h2>
          {usageStats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">{usageStats.today}</div>
                  <div className="text-white/60 text-sm">API Calls Today</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">{usageStats.thisWeek}</div>
                  <div className="text-white/60 text-sm">This Week</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">{usageStats.thisMonth.toLocaleString()}</div>
                  <div className="text-white/60 text-sm">This Month</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">
                    {usageStats.rateLimit.hourly.used}/{usageStats.rateLimit.hourly.total}
                  </div>
                  <div className="text-white/60 text-sm">Rate Limit (Hour)</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-10 text-center">
              <p className="text-white/60 text-sm">Loading statistics...</p>
            </div>
          )}
        </div>
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/[0.1] to-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/[0.15] p-7 max-w-md w-full">
            <h3 className="text-xl font-medium text-white mb-3">Generate New API Key</h3>
            <p className="text-white/60 text-sm mb-5">Give your API key a descriptive name to help you identify it later.</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-white/80 mb-2">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production Key, Mobile App, Testing"
                className="w-full rounded-xl bg-white/5 border border-white/20 focus:border-white/40 focus:bg-white/[0.08] outline-none px-4 py-3 text-white placeholder-white/40 text-sm transition-all duration-200"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="flex-1 px-5 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Key
              </button>
              <button
                onClick={() => {
                  setShowNewKeyModal(false)
                  setNewKeyName('')
                }}
                className="flex-1 px-5 py-3 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Newly Created Key Modal */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/[0.1] to-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/[0.15] p-7 max-w-lg w-full">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">API Key Created!</h3>
              <p className="text-white/60 text-sm">Save this key now. You won't be able to see it again.</p>
            </div>

            <div className="bg-black/60 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-wider">Your API Key</span>
                <button
                  onClick={() => copyToClipboard(newlyCreatedKey)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <code className="text-sm text-white font-mono break-all">{newlyCreatedKey}</code>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-5">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-yellow-400">
                  Store this key securely. Anyone with this key can make API requests on your behalf.
                </p>
              </div>
            </div>

            <button
              onClick={() => setNewlyCreatedKey(null)}
              className="w-full px-5 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              I've Saved My Key
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
