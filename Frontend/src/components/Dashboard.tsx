import { useState, useEffect } from 'react'
import { type PatientData } from './PatientDetails'

type Analysis = {
  id: string
  patientData: PatientData
  result: { prediction: number }
  imageData?: string // base64 image
  fileName: string
  processingTime?: number
  date: string
}

interface DashboardProps {
  onBack: () => void
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)

  const loadAnalyses = () => {
    const savedAnalyses = JSON.parse(localStorage.getItem('seedora_analyses') || '[]')
    console.log('Loaded analyses from localStorage:', savedAnalyses.length)
    setAnalyses(savedAnalyses.reverse()) // Show newest first
  }

  useEffect(() => {
    loadAnalyses()
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

  const getRiskColor = (prediction: number) => {
    if (prediction < 30) return 'from-green-400/20 to-green-400/10'
    if (prediction < 70) return 'from-yellow-400/20 to-yellow-400/10'
    return 'from-red-400/20 to-red-400/10'
  }

  const getRecommendation = (prediction: number) => {
    if (prediction < 30) {
      return "Continue regular foot care and monitoring. Schedule routine check-ups as recommended by your healthcare provider."
    } else if (prediction < 70) {
      return "Increased monitoring recommended. Please consult with your healthcare provider for a comprehensive foot examination and personalized care plan."
    } else {
      return "Immediate medical attention recommended. Please consult with a healthcare professional as soon as possible for a thorough evaluation and treatment plan."
    }
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light text-white mb-2">
                  Analysis <span className="font-normal">Dashboard</span>
                </h1>
                <p className="text-white/60 text-sm">
                  View and manage all previous patient analyses and DFU risk assessments
                </p>
              </div>
              <button
                onClick={loadAnalyses}
                className="ml-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                title="Refresh analyses"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/[0.08] outline-none px-4 py-3 pl-11 text-white placeholder-white/40 text-sm transition-all duration-200"
            />
            <svg className="w-4 h-4 text-white/40 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
            <div className="text-center">
              <div className="text-3xl font-light text-white mb-2">{analyses.length}</div>
              <div className="text-white/60 text-sm">Total Analyses</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
            <div className="text-center">
              <div className="text-3xl font-light text-red-400 mb-2">
                {analyses.filter(a => a.result.prediction >= 70).length}
              </div>
              <div className="text-white/60 text-sm">High Risk Cases</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
            <div className="text-center">
              <div className="text-3xl font-light text-green-400 mb-2">
                {analyses.filter(a => a.result.prediction < 30).length}
              </div>
              <div className="text-white/60 text-sm">Low Risk Cases</div>
            </div>
          </div>
        </div>

        {/* Analyses List */}
        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-lg font-medium text-white">Recent Analyses</h2>
          </div>

          {filteredAnalyses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-white/60 mb-3 text-sm">
                {analyses.length === 0 ? 'No analyses found' : 'No analyses match your search'}
              </div>
              {analyses.length === 0 && (
                <p className="text-white/40 text-xs">
                  Start by creating a new analysis to see patient data here
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredAnalyses.map((analysis) => {
                const risk = getRiskLevel(analysis.result.prediction)
                return (
                  <div key={analysis.id} className="p-5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-white font-medium text-base">
                            {analysis.patientData.name || 'Unnamed Patient'}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${risk.color}`}>
                            {risk.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-white/50 text-xs">Age:</span>
                            <span className="text-white ml-2">{analysis.patientData.age || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-white/50 text-xs">Phone:</span>
                            <span className="text-white ml-2">{analysis.patientData.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-white/50 text-xs">Date:</span>
                            <span className="text-white ml-2">{new Date(analysis.date).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-white/50 text-xs">File:</span>
                            <span className="text-white ml-2 truncate block max-w-[150px]">{analysis.fileName}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedAnalysis(analysis)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
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

      {/* Detail View Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-black/95 backdrop-blur-xl rounded-3xl border border-white/20 max-w-5xl w-full my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-xl z-10 rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-medium text-white mb-1">Analysis Details</h2>
                <p className="text-white/50 text-sm">
                  {new Date(selectedAnalysis.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Risk Assessment - Hero Section */}
              <div className={`bg-gradient-to-br ${getRiskColor(selectedAnalysis.result.prediction)} rounded-2xl border border-white/10 p-6`}>
                <div className="flex items-center gap-6">
                  {/* Circular Progress */}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-white/10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${selectedAnalysis.result.prediction * 2.64} 264`}
                        className={
                          selectedAnalysis.result.prediction < 30 ? 'text-green-400' :
                            selectedAnalysis.result.prediction < 70 ? 'text-yellow-400' : 'text-red-400'
                        }
                        style={{ strokeLinecap: 'round' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-light text-white">
                          {selectedAnalysis.result.prediction.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Info */}
                  <div>
                    <p className="text-white/60 text-sm mb-2">DFU Risk Assessment</p>
                    <div className={`inline-flex items-center px-4 py-2 rounded-xl text-base font-medium border ${getRiskLevel(selectedAnalysis.result.prediction).color}`}>
                      {getRiskLevel(selectedAnalysis.result.prediction).label}
                    </div>
                    {selectedAnalysis.processingTime && (
                      <p className="text-white/40 text-xs mt-3">
                        Analyzed in {selectedAnalysis.processingTime}s using ResNet-152
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Thermogram Image */}
                {selectedAnalysis.imageData && (
                  <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-5">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={1.5} />
                        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
                        <path d="M21 15l-5-5L5 21" strokeWidth={1.5} />
                      </svg>
                      Thermogram Image
                    </h3>
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <img
                        src={selectedAnalysis.imageData}
                        alt="Thermogram"
                        className="w-full h-auto max-h-[400px] object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-white/50 text-xs truncate">{selectedAnalysis.fileName}</p>
                      <p className="text-white/40 text-xs">
                        {new Date(selectedAnalysis.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Patient Information */}
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-5">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Patient Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider">Name</label>
                      <p className="text-white text-sm font-medium mt-1">{selectedAnalysis.patientData.name || 'Not specified'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider">Age</label>
                        <p className="text-white text-sm font-medium mt-1">{selectedAnalysis.patientData.age || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider">Gender</label>
                        <p className="text-white text-sm font-medium mt-1 capitalize">{selectedAnalysis.patientData.gender || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider">Phone</label>
                      <p className="text-white text-sm font-medium mt-1">{selectedAnalysis.patientData.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider">Email</label>
                      <p className="text-white text-sm font-medium mt-1 break-all">{selectedAnalysis.patientData.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              {(selectedAnalysis.patientData.medicalHistory || selectedAnalysis.patientData.currentSymptoms) && (
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-5">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Medical History
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Medical History</label>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {selectedAnalysis.patientData.medicalHistory || 'No medical history provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Current Symptoms</label>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {selectedAnalysis.patientData.currentSymptoms || 'No symptoms reported'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Recommendation */}
              <div className={`bg-gradient-to-br ${selectedAnalysis.result.prediction < 30 ? 'from-green-400/10 to-green-400/5 border-green-400/20' :
                selectedAnalysis.result.prediction < 70 ? 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/20' :
                  'from-red-400/10 to-red-400/5 border-red-400/20'
                } rounded-2xl border p-5`}>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Medical Recommendation
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {getRecommendation(selectedAnalysis.result.prediction)}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 sticky bottom-0 bg-black/95 backdrop-blur-xl rounded-b-3xl">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="w-full px-5 py-3 bg-white text-black rounded-2xl text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
