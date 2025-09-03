import { useState } from 'react'
import AnimatedBackground from './AnimatedBackground'

type UploadPageProps = {
  onBack: () => void
}

export default function UploadPage({ onBack }: UploadPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    height: '',
    weight: ''
  })
  const [result, setResult] = useState<{
    riskPercentage: number
    riskLevel: 'Low' | 'Medium' | 'High'
    recommendations: string[]
    confidence: number
  } | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
    setAnalyzing(true)
    
    // Simulate AI analysis - replace with actual API call
    setTimeout(() => {
      const mockRisk = Math.floor(Math.random() * 100)
      const riskLevel = mockRisk < 30 ? 'Low' : mockRisk < 70 ? 'Medium' : 'High'
      
      setResult({
        riskPercentage: mockRisk,
        riskLevel,
        confidence: 0.85 + Math.random() * 0.1,
        recommendations: [
          'Regular foot inspection recommended',
          'Maintain optimal blood glucose levels',
          'Use proper diabetic footwear',
          'Schedule follow-up with healthcare provider',
          'Monitor for any changes in skin temperature'
        ]
      })
      setAnalyzing(false)
    }, 3000)
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setResult(null)
    setAnalyzing(false)
    setPatientInfo({ age: '', gender: '', height: '', weight: '' })
  }

  return (
    <div className="w-full min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
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
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
              AI-Powered <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Thermogram Analysis</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Upload your thermogram image for advanced diabetic foot ulcer risk assessment using our ResNet-152 and DenseNet models
            </p>
          </div>
        </div>

        {!result ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Thermogram
              </h2>
              
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 min-h-[300px] flex flex-col justify-center ${
                  dragActive
                    ? 'border-blue-400 bg-blue-400/10 scale-[1.02]'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {selectedFile ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white font-medium text-lg">{selectedFile.name}</p>
                      <p className="text-white/60 text-sm mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                      </p>
                    </div>
                    <button
                      onClick={resetAnalysis}
                      className="inline-flex items-center text-white/70 hover:text-white text-sm transition-colors group"
                    >
                      <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10">
                          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        {/* Floating animation elements */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400/30 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-2 w-3 h-3 bg-purple-400/30 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-white">Upload Thermogram Image</h3>
                      <p className="text-white/70">Drop your thermogram image here or click to browse</p>
                      <div className="flex items-center justify-center space-x-6 text-sm text-white/50">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                          </svg>
                          JPG, PNG, TIFF
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Max 10MB
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patient Information
                <span className="ml-2 text-xs text-white/50">(Optional)</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Gender</label>
                  <select 
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:bg-white/10 outline-none transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="Enter height"
                    value={patientInfo.height}
                    onChange={(e) => setPatientInfo({...patientInfo, height: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="Enter weight"
                    value={patientInfo.weight}
                    onChange={(e) => setPatientInfo({...patientInfo, weight: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Patient information helps improve analysis accuracy but is not required for basic assessment.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h2 className="text-3xl font-light text-white mb-8 text-center">Analysis Results</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Risk Assessment */}
              <div className="text-center">
                <div className="relative w-56 h-56 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-white/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${result.riskPercentage * 2.51} 251`}
                      className={
                        result.riskLevel === 'Low'
                          ? 'text-green-400'
                          : result.riskLevel === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }
                      style={{
                        strokeLinecap: 'round',
                        transition: 'stroke-dasharray 1s ease-in-out'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-light text-white mb-1">{result.riskPercentage}%</div>
                      <div className="text-sm text-white/70">DFU Risk</div>
                    </div>
                  </div>
                </div>
                
                <div
                  className={`inline-flex px-6 py-3 rounded-full text-sm font-medium mb-4 ${
                    result.riskLevel === 'Low'
                      ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                      : result.riskLevel === 'Medium'
                      ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                      : 'bg-red-400/20 text-red-400 border border-red-400/30'
                  }`}
                >
                  {result.riskLevel} Risk Level
                </div>
                
                <div className="text-white/60 text-sm">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>
              
              {/* Recommendations */}
              <div>
                <h3 className="text-xl font-medium text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-white/80">{rec}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-purple-200 text-sm">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    This analysis is for screening purposes only. Consult a healthcare professional for medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-8 text-center">
          {!result ? (
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || analyzing}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedFile && !analyzing
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {analyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing Thermogram...
                </div>
              ) : (
                'Start AI Analysis'
              )}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetAnalysis}
                className="px-6 py-3 border border-white/20 text-white rounded-full text-sm hover:bg-white/5 transition-all duration-300"
              >
                Analyze Another Image
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                Download Report
              </button>
              <button className="px-6 py-3 border border-white/20 text-white rounded-full text-sm hover:bg-white/5 transition-all duration-300">
                Share Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}