import { useState } from 'react'

type PatientDetailsProps = {
  onNext: (patientData: PatientData) => void
  onBack: () => void
}

export type PatientData = {
  name: string
  age: string
  gender: string
  phone: string
  email: string
  medicalHistory: string
  currentSymptoms: string
  notes: string
}

export default function PatientDetails({ onNext, onBack }: PatientDetailsProps) {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    medicalHistory: '',
    currentSymptoms: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(patientData)
  }

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Step Indicator */}
      <div className="mb-5">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 text-black font-medium text-xs">
              1
            </div>
            <span className="ml-2 text-white font-medium text-xs">Patient Details</span>
          </div>
          <div className="w-12 h-0.5 bg-white/20"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/40 font-medium text-xs">
              2
            </div>
            <span className="ml-2 text-white/40 font-medium text-xs">Upload & Analyze</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-5 text-center">
        <h1 className="text-2xl md:text-3xl font-light text-white mb-2">
          Patient <span className="font-normal">Information</span>
        </h1>
        <p className="text-white/60 text-xs">All fields are optional</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Form Content */}
        <div className="space-y-5">
          {/* Single Compact Card */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Patient Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/80">Patient Name</label>
                <input
                  value={patientData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  type="text"
                  placeholder="Full name"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.08] rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
                />
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/80">Age</label>
                <input
                  value={patientData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  type="number"
                  placeholder="Age"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.08] rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/80">Gender</label>
                <select
                  value={patientData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem'
                  }}
                >
                  <option value="" className="bg-gray-900">Select</option>
                  <option value="male" className="bg-gray-900">Male</option>
                  <option value="female" className="bg-gray-900">Female</option>
                  <option value="other" className="bg-gray-900">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/80">Phone Number</label>
                <input
                  value={patientData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  type="tel"
                  placeholder="Phone number"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.08] rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/80">Email Address</label>
                <input
                  value={patientData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.08] rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medical History */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/80">Medical History</label>
                <textarea
                  value={patientData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  placeholder="Diabetes duration, complications, etc."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-400/50 focus:bg-white/[0.08] rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 resize-none"
                />
              </div>

              {/* Current Symptoms */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/80">Current Symptoms</label>
                <textarea
                  value={patientData.currentSymptoms}
                  onChange={(e) => handleInputChange('currentSymptoms', e.target.value)}
                  placeholder="Pain, numbness, or other concerns"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-400/50 focus:bg-white/[0.08] rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-5 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/10"
          >
            Continue
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
