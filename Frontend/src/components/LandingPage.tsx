import AnimatedBackground from './AnimatedBackground'
import FAQ from './FAQ'

type LandingPageProps = {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {

  const stats = [
    { number: "212M", label: "Diabetic patients in India" },
    { number: "25%", label: "At risk of developing DFU" },
    { number: "100K", label: "Annual amputations prevented" },
    { number: "$361.2M", label: "Market size by 2030" }
  ]

  return (
    <div className="w-full relative">
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Award-winning AI healthcare solution
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6">
              Early Detection of
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Diabetic Foot Ulcers
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              ThermoFoot uses advanced AI and thermogram analysis to detect diabetic foot ulcers 
              before they become critical, helping prevent 100,000+ annual amputations in India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
              >
                Start Analysis
              </button>
              <button className="px-6 py-2.5 border border-white/20 text-white rounded-full text-sm hover:bg-white/5 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-light text-white mb-2">{stat.number}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              Revolutionary Healthcare Technology
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Combining deep learning, IoT, and medical expertise to transform diabetic care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-blue-400">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Technology Section */}
      <section className="py-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              Revolutionary Healthcare Technology
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Combining deep learning, IoT, and medical expertise to transform diabetic care
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Non-Invasive Detection</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Advanced thermogram analysis using AI to detect diabetic foot ulcers without physical contact
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Early Screening</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Identify potential issues before visible symptoms appear, preventing complications
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Remote Accessibility</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Get professional-grade analysis from anywhere, making healthcare more accessible
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-green-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center border border-green-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Continuous Monitoring</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Regular tracking and monitoring for diabetic patients at risk
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Awards Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              Recognized Excellence
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mb-4 flex justify-center">
                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">SEED Hackathon</h3>
              <p className="text-white/70">2nd Place International</p>
              <p className="text-white/60">$35,000 Prize</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mb-4 flex justify-center">
                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">ISB Hyderabad</h3>
              <p className="text-white/70">First Runner-up</p>
              <p className="text-white/60">₹75,000 Prize</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mb-4 flex justify-center">
                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Hult Prize Nationals</h3>
              <p className="text-white/70">Top 8 Finalists</p>
              <p className="text-white/60">2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
            Ready to Transform Diabetic Care?
          </h2>
          <p className="text-lg text-white/70 mb-12">
            Join the revolution in early detection and prevention of diabetic foot ulcers
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 bg-white text-black rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Start Your Analysis Today
          </button>
        </div>
      </section>
    </div>
  )
}
