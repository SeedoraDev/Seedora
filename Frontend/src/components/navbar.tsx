type NavbarProps = {
  onLogin: () => void
  onSignup: () => void
  onHome?: () => void
}

export default function Navbar({ onLogin, onSignup, onHome }: NavbarProps) {
  return (
    <header className="w-full border-b border-white/10">
      <nav className="mx-auto max-w-5xl w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
        <button
          onClick={onHome}
          className="text-sm md:text-base tracking-wide text-left hover:text-white/80 transition-colors"
          aria-label="Go to Seedora home"
        >
          Seedora
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onLogin}
            className="rounded-3xl border border-white/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white hover:border-white/40 hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            Login
          </button>
          <button
            onClick={onSignup}
            className="rounded-3xl bg-white text-black px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm hover:bg-white/90 active:bg-white transition-colors"
          >
            Sign up
          </button>
        </div>
      </nav>
    </header>
  )
}


