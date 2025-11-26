import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../contexts/AnalysisContext';
import PatientDetails, { type PatientData } from './PatientDetails'

interface UploadPageProps {
  onBack: () => void
}

type AnalysisStep = 'patient-details' | 'upload'

export default function UploadPage({ onBack }: UploadPageProps) {
  const { analysisState, startAnalysis, clearAnalysis } = useAnalysis()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('patient-details')
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        clearAnalysis();
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      clearAnalysis();
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    startAnalysis(analyzeImage);
  };

  const resetAnalysis = () => {
    setSelectedFile(null)
    setImagePreview(null)
    clearAnalysis()
    setCurrentStep('patient-details')
    setPatientData(null)
  }

  const handlePatientDetailsNext = (data: PatientData) => {
    setPatientData(data)
    setCurrentStep('upload')
  }

  const handleBackToPatientDetails = () => {
    setCurrentStep('patient-details')
  }

  const saveAnalysisToStorage = (result: any) => {
    if (!imagePreview) return // Only require image

    const processingTime = analysisState.startTime
      ? Math.floor((Date.now() - analysisState.startTime) / 1000)
      : 0

    // Use patient data if available, otherwise use placeholder
    const analysisPatientData = patientData || {
      name: 'Not specified',
      age: '',
      gender: '',
      phone: '',
      email: '',
      medicalHistory: '',
      currentSymptoms: ''
    }

    const analysis = {
      id: Date.now().toString(),
      patientData: analysisPatientData,
      result,
      imageData: imagePreview, // Store base64 image
      fileName: selectedFile?.name || 'Unknown',
      processingTime, // in seconds
      date: new Date().toISOString()
    }

    const existingAnalyses = JSON.parse(localStorage.getItem('seedora_analyses') || '[]')
    existingAnalyses.push(analysis)

    // Keep only last 50 analyses to prevent localStorage overflow
    const recentAnalyses = existingAnalyses.slice(-50)
    localStorage.setItem('seedora_analyses', JSON.stringify(recentAnalyses))

    console.log('Analysis saved to localStorage:', analysis.id)
  }

  // Save analysis when results are available
  useEffect(() => {
    if (analysisState.result && imagePreview) {
      saveAnalysisToStorage(analysisState.result)
    }
  }, [analysisState.result, imagePreview])

  // Automatically show results when navigating to upload page with active analysis
  useEffect(() => {
    if (analysisState.result && currentStep === 'patient-details') {
      setCurrentStep('upload')
    }
  }, [analysisState.result])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
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
              DFU Risk <span className="font-normal">Analysis</span>
            </h1>
            <p className="text-white/60 text-sm">
              Upload thermogram images for diabetic foot ulcer risk assessment
            </p>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'patient-details' && (
          <PatientDetails
            onNext={handlePatientDetailsNext}
            onBack={onBack}
          />
        )}

        {currentStep === 'upload' && (
          <>
            {!analysisState.result ? (
              <div className="max-w-4xl mx-auto">
                {/* Step Indicator */}
                <div className="mb-5">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-400 text-black font-medium text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-2 text-white/60 font-medium text-xs">Patient Details</span>
                    </div>
                    <div className="w-12 h-0.5 bg-white/20"></div>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 text-black font-medium text-xs">
                        2
                      </div>
                      <span className="ml-2 text-white font-medium text-xs">Upload & Analyze</span>
                    </div>
                  </div>
                </div>

                {/* Loading Overlay */}
                {analysisState.isAnalyzing && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.15] p-10 text-center max-w-md mx-4 shadow-2xl">
                      <div className="relative w-28 h-28 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${analysisState.progress * 2.51} 251`}
                            className="text-blue-400"
                            style={{
                              strokeLinecap: 'round',
                              transition: 'stroke-dasharray 0.5s ease-in-out'
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-light text-white mb-1">{Math.round(analysisState.progress)}%</div>
                            <div className="text-xs text-white/60">Processing</div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-light text-white mb-2">AI Analysis in Progress</h3>
                      <p className="text-white/70 text-sm mb-5">
                        {analysisState.progress < 30 ? 'Preprocessing thermogram...' :
                          analysisState.progress < 70 ? 'Running AI model analysis...' :
                            'Calculating risk assessment...'}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-white/40 text-xs">
                        <div className="animate-pulse">●</div>
                        <span>Please wait while we analyze your image</span>
                        <div className="animate-pulse delay-300">●</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Section */}
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.12] shadow-2xl overflow-hidden">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-xl p-3 border border-white/[0.15]">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={1.5} />
                            <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
                            <path d="M21 15l-5-5L5 21" strokeWidth={1.5} />
                          </svg>
                        </div>
                      </div>
                      <h2 className="text-2xl font-light text-white mb-2">Upload Thermogram</h2>
                      <p className="text-white/60 text-sm">Drag and drop your image or click to browse</p>
                    </div>

                    <div
                      className={`relative border-2 border-dashed rounded-xl transition-all duration-500 min-h-[320px] flex flex-col justify-center ${dragActive
                        ? 'border-blue-400/50 bg-gradient-to-br from-blue-400/[0.08] to-purple-400/[0.05] scale-[1.02] shadow-lg shadow-blue-400/10'
                        : 'border-white/[0.2] hover:border-white/40 hover:bg-white/[0.03]'
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      {selectedFile ? (
                        <div className="space-y-5 p-5">
                          {/* Image Preview */}
                          {imagePreview && (
                            <div className="flex justify-center mb-3">
                              <div className="relative rounded-xl overflow-hidden border border-white/20 max-w-xs">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-auto"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-2xl blur-lg"></div>
                              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-2xl flex items-center justify-center border border-emerald-400/40 backdrop-blur-sm">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-xl p-5 border border-white/[0.12] backdrop-blur-sm">
                            <div className="text-center">
                              <p className="text-white font-medium text-base mb-2">{selectedFile.name}</p>
                              <p className="text-white/60 text-sm mb-3">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                              </p>
                              <div className="inline-flex items-center px-3 py-1.5 bg-emerald-400/20 text-emerald-400 rounded-full text-xs border border-emerald-400/30">
                                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                File validated
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={resetAnalysis}
                            className="inline-flex items-center text-white/60 hover:text-white transition-all duration-300 group mx-auto text-sm"
                          >
                            <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Choose different file
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6 p-6">
                          <div className="flex justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] to-white/[0.05] rounded-3xl blur-xl"></div>
                              <div className="relative w-24 h-24 bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-3xl flex items-center justify-center border border-white/[0.15] backdrop-blur-sm">
                                <svg className="w-12 h-12 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-6 text-center">
                            <div>
                              <h3 className="text-2xl font-light text-white mb-2">Drop your thermogram here</h3>
                              <p className="text-white/60 text-base">or click to browse files from your device</p>
                            </div>
                            <div className="flex items-center justify-center space-x-8 text-sm text-white/50 pt-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>JPG, PNG, TIFF</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span>Max 10MB</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleBackToPatientDetails}
                    className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Patient Details
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || analysisState.isAnalyzing}
                    className={`px-8 py-4 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${selectedFile && !analysisState.isAnalyzing
                      ? 'bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                      }`}
                  >
                    {analysisState.isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/40"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Start AI Analysis
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Results Section */
              <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl border border-green-400/30 mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-2">Analysis Complete</h2>
                  <p className="text-white/60">AI-powered diabetic foot ulcer risk assessment results</p>
                </div>

                {analysisState.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                    <p className="text-red-400">{analysisState.error}</p>
                  </div>
                )}

                {/* Main Results Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Risk Visualization Card */}
                  <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.1] p-8">
                    <h3 className="text-xl font-light text-white mb-6 text-center">Risk Assessment</h3>
                    <div className="text-center">
                      <div className="relative w-56 h-56 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${(analysisState.result?.prediction || 0) * 2.2} 220`}
                            className={
                              (analysisState.result?.prediction || 0) < 30 ? 'text-green-400' :
                                (analysisState.result?.prediction || 0) < 70 ? 'text-yellow-400' :
                                  'text-red-400'
                            }
                            style={{
                              strokeLinecap: 'round',
                              transition: 'stroke-dasharray 1.5s ease-in-out'
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-light text-white mb-1">
                              {analysisState.result?.prediction.toFixed(2)}%
                            </div>
                            <div className="text-white/60 text-xs uppercase tracking-wider">DFU Risk</div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center px-6 py-3 rounded-full text-base font-medium ${(analysisState.result?.prediction || 0) < 30
                          ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                          : (analysisState.result?.prediction || 0) < 70
                            ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                            : 'bg-red-400/20 text-red-400 border border-red-400/30'
                          }`}
                      >
                        {(analysisState.result?.prediction || 0) < 30 ? 'Low Risk' :
                          (analysisState.result?.prediction || 0) < 70 ? 'Medium Risk' :
                            'High Risk'}
                      </div>
                    </div>
                  </div>

                  {/* Patient & Analysis Details Card */}
                  <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.1] p-8">
                    <h3 className="text-xl font-light text-white mb-6">Assessment Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-white/70 text-sm">Patient</span>
                        </div>
                        <span className="text-white text-sm font-medium">{patientData?.name || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-white/70 text-sm">AI Model</span>
                        </div>
                        <span className="text-white text-sm font-medium">ResNet-152</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-white/70 text-sm">Processing Time</span>
                        </div>
                        <span className="text-white text-sm font-medium">
                          {analysisState.startTime ? `${Math.floor((Date.now() - analysisState.startTime) / 1000)}s` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-white/70 text-sm">Analysis Date</span>
                        </div>
                        <span className="text-white text-sm font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Card */}
                <div className="bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-3xl p-8 border border-blue-400/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white mb-3">Medical Recommendation</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {(analysisState.result?.prediction || 0) < 30
                          ? "The analysis indicates a low risk of diabetic foot ulcers. Continue regular foot care practices, maintain good blood sugar control, and schedule routine check-ups with your healthcare provider."
                          : (analysisState.result?.prediction || 0) < 70
                            ? "The analysis shows a medium risk level. We recommend increased monitoring and consultation with a podiatrist. Regular foot examinations and preventive care are essential at this stage."
                            : "The analysis indicates a high risk of diabetic foot ulcers. Immediate medical attention is strongly recommended. Please consult with your healthcare professional as soon as possible for a comprehensive evaluation and treatment plan."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                  <button
                    onClick={resetAnalysis}
                    className="px-8 py-4 bg-white text-black rounded-2xl text-sm font-medium hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    New Analysis
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
