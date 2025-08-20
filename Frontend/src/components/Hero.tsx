type HeroProps = {
  onNotify?: () => void
}

export default function Hero({ onNotify }: HeroProps) {
  return (
    <section className="text-center space-y-3 sm:space-y-4 max-w-md mx-auto">
      <h1 className="text-base sm:text-lg md:text-xl tracking-wide">Welcome to Seedor.AI</h1>
      <p className="text-sm md:text-base text-white/70">Under development</p>
      <div className="pt-1">
        <button
          onClick={onNotify}
          className="rounded-3xl border border-white/20 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm text-white hover:border-white/40 hover:bg-white/5 active:bg-white/10 transition-colors"
        >
          Notify
        </button>
      </div>
    </section>
  )
}


