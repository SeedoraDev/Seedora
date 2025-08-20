export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10">
      <div className="mx-auto max-w-5xl w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 text-xs text-white/60">
        <span>© {new Date().getFullYear()} Seedora</span>
        <div className="flex items-center gap-3">
          <a className="hover:text-white transition-colors" href="#">Privacy</a>
          <a className="hover:text-white transition-colors" href="#">Terms</a>
        </div>
      </div>
    </footer>
  )
}


