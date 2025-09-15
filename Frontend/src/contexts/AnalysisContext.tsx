import React, { createContext, useContext, useState, useCallback } from 'react'

interface AnalysisState {
  isAnalyzing: boolean
  fileName: string | null
  progress: number
  result: { prediction: number } | null
  error: string | null
  startTime: number | null
}

interface AnalysisContextType {
  analysisState: AnalysisState
  startAnalysis: (analysisFunction: () => Promise<any>) => Promise<void>
  clearAnalysis: () => void
  isBackgroundAnalysis: boolean
  setCurrentView: (view: string) => void
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
}

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    fileName: null,
    progress: 0,
    result: null,
    error: null,
    startTime: null
  })
  const [currentView, setCurrentView] = useState('home')

  const startAnalysis = useCallback(async (analysisFunction: () => Promise<any>) => {
    setAnalysisState({
      isAnalyzing: true,
      fileName: null,
      progress: 0,
      result: null,
      error: null,
      startTime: Date.now()
    })

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 20, 90)
      }))
    }, 500)

    try {
      const data = await analysisFunction()
      
      clearInterval(progressInterval)
      
      setAnalysisState(prev => ({
        ...prev,
        isAnalyzing: false,
        progress: 100,
        result: data,
        error: null
      }))
    } catch (err) {
      clearInterval(progressInterval)
      setAnalysisState(prev => ({
        ...prev,
        isAnalyzing: false,
        progress: 0,
        error: err instanceof Error ? err.message : 'An error occurred during analysis',
        result: null
      }))
    }
  }, [])

  const clearAnalysis = useCallback(() => {
    setAnalysisState({
      isAnalyzing: false,
      fileName: null,
      progress: 0,
      result: null,
      error: null,
      startTime: null
    })
  }, [])

  const isBackgroundAnalysis = Boolean(analysisState.isAnalyzing || analysisState.result || analysisState.error) && currentView !== 'upload'

  return (
    <AnalysisContext.Provider value={{
      analysisState,
      startAnalysis,
      clearAnalysis,
      isBackgroundAnalysis,
      setCurrentView
    }}>
      {children}
    </AnalysisContext.Provider>
  )
}
