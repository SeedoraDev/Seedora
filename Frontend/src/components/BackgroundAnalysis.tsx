import { useState } from 'react'
import { useAnalysis } from '../contexts/AnalysisContext'

interface BackgroundAnalysisProps {
  currentView: string
  onViewDetails: () => void
}

export default function BackgroundAnalysis({ currentView, onViewDetails }: BackgroundAnalysisProps) {
  const { analysisState, clearAnalysis } = useAnalysis()
  const [isMinimized, setIsMinimized] = useState(false)

  // Only show if there's analysis state AND user is not on upload page
  const shouldShow = (analysisState.isAnalyzing || analysisState.result || analysisState.error) &&
    currentView !== 'upload'

  if (!shouldShow) {
    return null
  }

  const getElapsedTime = () => {
    if (!analysisState.startTime) return '0s'
    const elapsed = Math.floor((Date.now() - analysisState.startTime) / 1000)
    return elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
  }

  const getRiskColor = (prediction: number) => {
    if (prediction < 30) return 'text-green-400'
    if (prediction < 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskLevel = (prediction: number) => {
    if (prediction < 30) return 'Low'
    if (prediction < 70) return 'Medium'
    return 'High'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-black/90 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 ${isMinimized ? 'w-16 h-16' : 'w-80'
        }`}>
        {isMinimized ? (
          // Minimized view
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            {analysisState.isAnalyzing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : analysisState.result ? (
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        ) : (
          // Expanded view
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={clearAnalysis}
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            {analysisState.isAnalyzing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Analyzing...</p>
                    <p className="text-white/60 text-xs">{analysisState.fileName}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{Math.round(analysisState.progress)}%</span>
                    <span>{getElapsedTime()}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${analysisState.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : analysisState.result ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-sm font-medium">Analysis Complete</span>
                </div>

                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-xs">DFU Risk</p>
                      <p className={`text-lg font-semibold ${getRiskColor(analysisState.result.prediction)}`}>
                        {analysisState.result.prediction.toFixed(4)}%
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${analysisState.result.prediction < 30
                        ? 'bg-green-400/20 text-green-400'
                        : analysisState.result.prediction < 70
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'bg-red-400/20 text-red-400'
                      }`}>
                      {getRiskLevel(analysisState.result.prediction)} Risk
                    </div>
                  </div>
                </div>

                <button
                  onClick={onViewDetails}
                  className="w-full bg-white text-black text-sm font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  View Details
                </button>
              </div>
            ) : analysisState.error ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-white text-sm font-medium">Analysis Failed</span>
                </div>

                <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-3">
                  <p className="text-red-400 text-xs">{analysisState.error}</p>
                </div>

                <button
                  onClick={onViewDetails}
                  className="w-full bg-white text-black text-sm font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
