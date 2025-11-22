import { useState, useEffect } from 'react'
import { type PatientData } from './PatientDetails'

type Analysis = {
  id: string
  patientData: PatientData
  result: { prediction: number }
  date: string
  fileName: string
}

interface DashboardProps {
  onBack: () => void
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const savedAnalyses = JSON.parse(localStorage.getItem('seedora_analyses') || '[]')
    setAnalyses(savedAnalyses.reverse()) // Show newest first
  }, [])

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.patientData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.patientData.phone.includes(searchTerm) ||
    analysis.patientData.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRiskLevel = (prediction: number) => {
    if (prediction < 30) return { label: 'Low Risk', color: 'text-green-400 bg-green-400/20 border-green-400/30' }
    if (prediction < 70) return { label: 'Medium Risk', color: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30' }
    return { label: 'High Risk', color: 'text-red-400 bg-red-400/20 border-red-400/30' }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-white transition-colors mb-6 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          <div className="border-l-2 border-white pl-6">
            <h1 className="text-4xl font-light text-white mb-2">
              Analysis <span className="font-normal">Dashboard</span>
            </h1>
            <p className="text-white/60">
              View and manage all previous patient analyses and DFU risk assessments
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl bg-black/20 border border-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/20 outline-none px-4 py-3 pl-12 text-white placeholder-white/50 text-sm"
            />
            <svg className="w-5 h-5 text-white/50 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black/30 rounded-3xl border border-black/40 p-6">
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">{analyses.length}</div>
            <div className="text-white/60 text-sm">Total Analyses</div>
          </div>
        </div>

        <div className="bg-black/30 rounded-3xl border border-black/40 p-6">
          <div className="text-center">
            <div className="text-3xl font-light text-red-400 mb-2">
              {analyses.filter(a => a.result.prediction >= 70).length}
            </div>
            <div className="text-white/60 text-sm">High Risk Cases</div>
          </div>
        </div>

        <div className="bg-black/30 rounded-3xl border border-black/40 p-6">
          <div className="text-center">
            <div className="text-3xl font-light text-green-400 mb-2">
              {analyses.filter(a => a.result.prediction < 30).length}
            </div>
            <div className="text-white/60 text-sm">Low Risk Cases</div>
          </div>
        </div>
      </div>

      {/* Analyses List */}
      <div className="bg-black/30 rounded-3xl border border-black/40 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Recent Analyses</h2>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-white/60 mb-4">
              {analyses.length === 0 ? 'No analyses found' : 'No analyses match your search'}
            </div>
            {analyses.length === 0 && (
              <p className="text-white/40 text-sm">
                Start by creating a new analysis to see patient data here
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredAnalyses.map((analysis) => {
              const risk = getRiskLevel(analysis.result.prediction)
              return (
                <div key={analysis.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-white font-medium">
                          {analysis.patientData.name || 'Unnamed Patient'}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${risk.color}`}>
                          {risk.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Age:</span>
                          <span className="text-white ml-2">{analysis.patientData.age || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Phone:</span>
                          <span className="text-white ml-2">{analysis.patientData.phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Date:</span>
                          <span className="text-white ml-2">{new Date(analysis.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-white/60">File:</span>
                          <span className="text-white ml-2">{analysis.fileName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-light text-white mb-1">
                        {analysis.result.prediction.toFixed(1)}%
                      </div>
                      <div className="text-white/60 text-xs">DFU Risk</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
