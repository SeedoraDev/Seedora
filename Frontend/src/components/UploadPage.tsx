import React, { useState } from 'react';
import { useAnalysis } from '../contexts/AnalysisContext';
import AnimatedBackground from './AnimatedBackground'

interface UploadPageProps {
  onBack: () => void
}

export default function UploadPage({ onBack }: UploadPageProps) {
  const { analysisState, startAnalysis, clearAnalysis } = useAnalysis()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

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
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/api/predict', {
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
    clearAnalysis()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
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

        {!analysisState.result ? (
          <div className="max-w-3xl mx-auto">
            {/* Loading Overlay */}
            {analysisState.isAnalyzing && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white/[0.05] backdrop-blur-sm rounded-3xl border border-white/[0.1] p-12 text-center max-w-md mx-4">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-white/20"
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
                        <div className="text-xs text-white/70">Analyzing</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-light text-white mb-2">AI Analysis in Progress</h3>
                  <p className="text-white/60 text-sm mb-4">Processing your thermogram using ResNet-152 and DenseNet models</p>
                  <div className="flex items-center justify-center space-x-2 text-white/40 text-xs">
                    <div className="animate-pulse">●</div>
                    <span>Please wait while we analyze your image</span>
                    <div className="animate-pulse delay-300">●</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Upload Section */}
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.12] shadow-2xl overflow-hidden">
              <div className="p-8 pb-6">
                <div className="text-center mb-6">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl p-4 border border-white/[0.15]">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={1.5}/>
                        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5}/>
                        <path d="M21 15l-5-5L5 21" strokeWidth={1.5}/>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-light text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text">Upload Thermogram</h2>
                  <p className="text-white/60 text-base">Drag and drop your image or click to browse</p>
                </div>
              
                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-all duration-500 min-h-[320px] flex flex-col justify-center ${
                    dragActive
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-8 p-8">
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-3xl blur-lg"></div>
                          <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-3xl flex items-center justify-center border border-emerald-400/40 backdrop-blur-sm">
                            <svg className="w-14 h-14 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-2xl p-8 border border-white/[0.12] backdrop-blur-sm">
                        <div className="text-center">
                          <p className="text-white font-medium text-xl mb-2">{selectedFile.name}</p>
                          <p className="text-white/60 text-sm mb-4">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI analysis
                          </p>
                          <div className="inline-flex items-center px-4 py-2 bg-emerald-400/20 text-emerald-400 rounded-full text-sm border border-emerald-400/30">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="space-y-8 p-8">
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] to-white/[0.05] rounded-3xl blur-xl"></div>
                          <div className="relative w-24 h-24 bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-3xl flex items-center justify-center border border-white/[0.15] backdrop-blur-sm">
                            <svg className="w-12 h-12 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={1.5}/>
                              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5}/>
                              <path d="M21 15l-5-5L5 21" strokeWidth={1.5}/>
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
          </div>
        ) : (
          /* Results Section */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-white mb-2">Analysis Complete</h2>
              <p className="text-white/60">AI-powered diabetic foot ulcer risk assessment results</p>
            </div>

            {analysisState.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <p className="text-red-400">{analysisState.error}</p>
              </div>
            )}

            {/* Hidden Print Report */}
            <div id="print-report" className="hidden">
              <div className="print-report">
                <div className="print-header">
                  <div className="print-logo">
                    <h1>Seedora</h1>
                    <p>AI-Powered Diabetic Foot Ulcer Risk Assessment</p>
                  </div>
                  <div className="print-date">
                    <p>Report Date: {new Date().toLocaleDateString()}</p>
                    <p>Report Time: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="print-content">
                  <div className="print-section">
                    <h2>Risk Assessment Results</h2>
                    <div className="print-risk-summary">
                      <div className="print-risk-score">
                        <span className="print-percentage">{analysisState.result?.prediction.toFixed(2)}%</span>
                        <span className="print-risk-label">DFU Risk Score</span>
                      </div>
                      <div className={`print-risk-badge ${
                        (analysisState.result?.prediction || 0) < 30 ? 'low-risk' : 
                        (analysisState.result?.prediction || 0) < 70 ? 'medium-risk' : 'high-risk'
                      }`}>
                        {(analysisState.result?.prediction || 0) < 30 ? 'Low Risk' : 
                         (analysisState.result?.prediction || 0) < 70 ? 'Medium Risk' : 'High Risk'}
                      </div>
                    </div>
                  </div>

                  <div className="print-section">
                    <h3>Assessment Details</h3>
                    <div className="print-details">
                      <div className="print-detail-row">
                        <span>Prediction Confidence:</span>
                        <span>High</span>
                      </div>
                      <div className="print-detail-row">
                        <span>AI Model Used:</span>
                        <span>ResNet-152 + DenseNet</span>
                      </div>
                      <div className="print-detail-row">
                        <span>Analysis Time:</span>
                        <span>{analysisState.startTime ? `${Math.floor((Date.now() - analysisState.startTime) / 1000)}s` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="print-section">
                    <h3>Clinical Recommendations</h3>
                    <div className="print-recommendations">
                      <p>{(analysisState.result?.prediction || 0) < 30 
                        ? "Continue regular foot care and monitoring. Schedule routine check-ups with your healthcare provider."
                        : (analysisState.result?.prediction || 0) < 70
                        ? "Increased monitoring recommended. Consider consulting with a podiatrist for preventive care strategies."
                        : "Immediate medical attention recommended. Please consult with a healthcare professional promptly for further evaluation."
                      }</p>
                    </div>
                  </div>

                  <div className="print-section">
                    <h3>Important Notice</h3>
                    <div className="print-disclaimer">
                      <p>This AI-powered assessment is intended for screening purposes only and should not replace professional medical diagnosis. Please consult with qualified healthcare professionals for comprehensive evaluation and treatment planning.</p>
                    </div>
                  </div>
                </div>

                <div className="print-footer">
                  <p>Generated by Seedora AI Platform | www.seedora.com</p>
                  <p>For medical inquiries, please contact your healthcare provider</p>
                </div>
              </div>
            </div>

            {/* Main Results Card */}
            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.1] p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Risk Visualization */}
                <div className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6">
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
                          (analysisState.result?.prediction || 0) < 30 ? 'text-green-400' : (analysisState.result?.prediction || 0) < 70 ? 'text-yellow-400' : 'text-red-400'
                        }
                        style={{
                          strokeLinecap: 'round',
                          transition: 'stroke-dasharray 1.5s ease-in-out'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">{analysisState.result?.prediction.toFixed(2)}%</div>
                        <div className="text-white/60 text-xs uppercase tracking-wider">DFU Risk</div>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      (analysisState.result?.prediction || 0) < 30
                        ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                        : (analysisState.result?.prediction || 0) < 70
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                        : 'bg-red-400/20 text-red-400 border border-red-400/30'
                    }`}
                  >
                    {(analysisState.result?.prediction || 0) < 30 ? 'Low Risk' : (analysisState.result?.prediction || 0) < 70 ? 'Medium Risk' : 'High Risk'}
                  </div>
                </div>

                {/* Risk Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-light text-white mb-4">Assessment Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/[0.04] rounded-lg">
                        <span className="text-white/70 text-sm">Confidence</span>
                        <span className="text-white text-sm">High</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/[0.04] rounded-lg">
                        <span className="text-white/70 text-sm">Model</span>
                        <span className="text-white text-sm">ResNet-152</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/[0.04] rounded-lg">
                        <span className="text-white/70 text-sm">Time</span>
                        <span className="text-white text-sm">{analysisState.startTime ? `${Math.floor((Date.now() - analysisState.startTime) / 1000)}s` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-blue-400/10 rounded-lg p-4 border border-blue-400/20">
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recommendation
                    </h4>
                    <div className="text-white/80 text-xs leading-relaxed">
                      {(analysisState.result?.prediction || 0) < 30 
                        ? "Continue regular foot care and monitoring."
                        : (analysisState.result?.prediction || 0) < 70
                        ? "Increased monitoring recommended. Consider consulting a podiatrist."
                        : "Immediate medical attention recommended. Consult healthcare professional."
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={resetAnalysis}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-100 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Analysis
              </button>
              <button
                onClick={() => {
                  const printContent = document.getElementById('print-report');
                  const originalContent = document.body.innerHTML;
                  
                  if (printContent) {
                    document.body.innerHTML = printContent.innerHTML;
                    window.print();
                    document.body.innerHTML = originalContent;
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        )}
        
        {/* Upload Action Button */}
        {!analysisState.result && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || analysisState.isAnalyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedFile && !analysisState.isAnalyzing
                  ? 'bg-white text-black hover:bg-gray-100 shadow-lg'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {analysisState.isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Analysis
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}