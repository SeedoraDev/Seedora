import './index.css'

function App() {
  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col">
      <header className="w-full border-b border-white/10">
        <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <span className="text-sm tracking-wide">Seedora</span>
          <div className="flex items-center gap-2">
            <button className="rounded-3xl border border-white/20 px-3 py-1.5 text-xs text-white hover:border-white/40 hover:bg-white/5 active:bg-white/10 transition-colors">Login</button>
            <button className="rounded-3xl bg-white text-black px-3 py-1.5 text-xs hover:bg-white/90 active:bg-white transition-colors">Sign up</button>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <section className="text-center space-y-3">
          <h1 className="text-base tracking-wide">Welcome to Seedora</h1>
          <p className="text-sm text-white/70">Under development</p>
          <div className="pt-1">
            <button className="rounded-3xl border border-white/20 px-4 py-2 text-xs text-white hover:border-white/40 hover:bg-white/5 active:bg-white/10 transition-colors">
              Notify 
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
