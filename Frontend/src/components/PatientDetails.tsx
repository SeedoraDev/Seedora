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
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 border-l-2 border-white pl-6">
        <h1 className="text-3xl font-light text-white mb-3">
          Patient Information <span className="font-normal">Entry</span>
        </h1>
        <p className="text-white/50 text-sm">
          Enter patient details before proceeding with the thermogram analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Information Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-white border-l-2 border-blue-400 pl-4">
            Patient Information
          </h2>
          <p className="text-white/40 text-xs pl-4">All fields are optional</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Patient Name</label>
              <input
                value={patientData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                type="text"
                placeholder="Enter patient's full name"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Age</label>
              <input
                value={patientData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                type="number"
                placeholder="Enter age"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Gender</label>
              <select
                value={patientData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="" className="bg-gray-900">Select gender</option>
                <option value="male" className="bg-gray-900">Male</option>
                <option value="female" className="bg-gray-900">Female</option>
                <option value="other" className="bg-gray-900">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Phone Number</label>
              <input
                value={patientData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                type="tel"
                placeholder="Enter phone number"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Email Address - Full Width */}
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Email Address</label>
            <input
              value={patientData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              type="email"
              placeholder="Enter email address"
              className="w-full bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-white border-l-2 border-purple-400 pl-4">
            Medical Information
          </h2>

          {/* Medical History */}
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Medical History</label>
            <textarea
              value={patientData.medicalHistory}
              onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
              placeholder="Enter relevant medical history, diabetes duration, etc."
              rows={3}
              className="w-full bg-white/5 border border-white/10 focus:border-purple-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 resize-none"
            />
          </div>

          {/* Current Symptoms */}
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Current Symptoms</label>
            <textarea
              value={patientData.currentSymptoms}
              onChange={(e) => handleInputChange('currentSymptoms', e.target.value)}
              placeholder="Describe any current foot-related symptoms or concerns"
              rows={3}
              className="w-full bg-white/5 border border-white/10 focus:border-purple-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 resize-none"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Additional Notes</label>
            <textarea
              value={patientData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes or observations"
              rows={2}
              className="w-full bg-white/5 border border-white/10 focus:border-purple-400/50 focus:bg-white/[0.07] rounded-3xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-3xl text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3.5 bg-white text-black rounded-3xl text-sm font-medium hover:bg-gray-100 transition-all duration-200"
          >
            Continue to Upload
          </button>
        </div>
      </form>
    </div>
  )
}
