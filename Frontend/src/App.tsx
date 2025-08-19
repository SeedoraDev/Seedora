import './index.css'

function App() {
  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col">
      <header className="w-full border-b border-white/10">
        <nav className="mx-auto max-w-5xl w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
          <span className="text-sm md:text-base tracking-wide">Seedora</span>
          <div className="flex items-center gap-2 md:gap-3">
            <button className="rounded-3xl border border-white/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white hover:border-white/40 hover:bg-white/5 active:bg-white/10 transition-colors">Login</button>
            <button className="rounded-3xl bg-white text-black px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm hover:bg-white/90 active:bg-white transition-colors">Sign up</button>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <section className="text-center space-y-3 sm:space-y-4 max-w-md mx-auto">
          <h1 className="text-base sm:text-lg md:text-xl tracking-wide">Welcome to Seedora</h1>
          <p className="text-sm md:text-base text-white/70">Under development</p>
          <div className="pt-1">
            <button className="rounded-3xl border border-white/20 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm text-white hover:border-white/40 hover:bg-white/5 active:bg-white/10 transition-colors">
              Notify
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
