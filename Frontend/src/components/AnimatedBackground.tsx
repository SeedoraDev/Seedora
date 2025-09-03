export default function AnimatedBackground() {
  return (
    <div className="inset-0 pointer-events-none overflow-hidden">
      {/* Static background elements with blue-purple mix */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-700/30 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-800/45 rounded-full blur-xl animate-pulse delay-3000"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-600/25 rounded-full blur-xl animate-pulse delay-1500"></div>
      <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-purple-700/30 rounded-full blur-xl animate-pulse delay-2500"></div>
      <div className="absolute top-2/3 left-1/3 w-16 h-16 bg-blue-800/35 rounded-full blur-xl animate-pulse delay-4000"></div>
      <div className="absolute top-1/2 left-1/8 w-22 h-22 bg-purple-600/20 rounded-full blur-xl animate-pulse delay-3500"></div>
      
      {/* Enhanced breathing elements in top-right area */}
      <div className="absolute top-16 right-20 w-40 h-40 bg-blue-700/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-32 right-32 w-60 h-60 bg-purple-700/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div className="absolute top-24 right-16 w-32 h-32 bg-blue-600/22 rounded-full blur-2xl animate-pulse delay-500"></div>
      <div className="absolute top-8 right-12 w-28 h-28 bg-purple-600/18 rounded-full blur-xl animate-pulse delay-1500"></div>

      {/* Floating particles with blue-purple mix and blur effects */}
      <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-blue-400/25 rounded-full blur-sm animate-pulse delay-100"></div>
      <div className="absolute top-3/4 left-1/5 w-3 h-3 bg-purple-400/30 rounded-full blur-sm animate-pulse delay-300"></div>
      <div className="absolute top-1/2 right-1/3 w-3.5 h-3.5 bg-blue-500/20 rounded-full blur-sm animate-pulse delay-700"></div>
      <div className="absolute bottom-1/4 left-2/3 w-3 h-3 bg-purple-600/25 rounded-full blur-sm animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 left-3/4 w-3.5 h-3.5 bg-blue-600/20 rounded-full blur-sm animate-pulse delay-400"></div>
      
      {/* Additional enhanced breathing particles with blur */}
      <div className="absolute top-1/5 right-1/5 w-5 h-5 bg-blue-500/20 rounded-full blur-md animate-pulse delay-200"></div>
      <div className="absolute top-2/5 right-1/6 w-4 h-4 bg-purple-400/18 rounded-full blur-sm animate-pulse delay-800"></div>
      <div className="absolute top-1/6 right-1/3 w-4 h-4 bg-blue-700/25 rounded-full blur-sm animate-pulse delay-1200"></div>
      <div className="absolute top-3/5 left-1/6 w-4 h-4 bg-purple-600/20 rounded-full blur-sm animate-pulse delay-1400"></div>
      <div className="absolute top-4/5 left-1/3 w-4 h-4 bg-purple-700/18 rounded-full blur-sm animate-pulse delay-1700"></div>
      
      {/* Enhanced gradient overlay with blue-purple mix */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/8 via-purple-900/5 to-purple-800/12"></div>
    </div>
  )
}
