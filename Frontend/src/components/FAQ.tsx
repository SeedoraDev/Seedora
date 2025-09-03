import { useState, useEffect, useRef } from 'react'

const faqData = [
  {
    question: "How accurate is ThermoFoot's AI detection?",
    answer: "ThermoFoot uses advanced deep learning models with over 95% accuracy in detecting early signs of diabetic foot ulcers through thermogram analysis."
  },
  {
    question: "Is the detection process non-invasive?",
    answer: "Yes, completely non-invasive. It uses thermal imaging to analyze temperature patterns without any physical contact or discomfort."
  },
  {
    question: "How quickly can I get results?",
    answer: "Results are available within minutes of uploading your thermogram image with instant AI processing and comprehensive analysis."
  },
  {
    question: "What equipment do I need?",
    answer: "Healthcare providers need a thermal camera. For patients, we offer an IoT solution with thermistors for convenient home monitoring."
  },
  {
    question: "How does this help prevent amputations?",
    answer: "Early detection enables timely intervention and treatment, significantly reducing complications that could lead to amputation."
  }
]

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  const toggleItem = (index: number) => {
    setOpenItem(prev => prev === index ? null : index)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (faqRef.current && !faqRef.current.contains(event.target as Node)) {
        setOpenItem(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/70 text-base max-w-2xl mx-auto">
            Get answers to common questions about ThermoFoot's AI-powered detection
          </p>
        </div>

        <div className="space-y-4" ref={faqRef}>
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-lg font-medium text-white pr-4">
                  {item.question}
                </h3>
                <div className={`flex-shrink-0 w-6 h-6 text-blue-400 transition-transform duration-300 ${
                  openItem === index ? 'rotate-180' : ''
                }`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="h-px bg-white/10 mb-4"></div>
                  <p className="text-white/70 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/60 mb-4">
            Still have questions?
          </p>
          <button className="px-6 py-3 border border-white/20 text-white rounded-full text-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}
