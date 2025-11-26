interface FooterProps {
  onPrivacy: () => void
  onTerms: () => void
}

export default function Footer({ onPrivacy, onTerms }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10">
      <div className="mx-auto max-w-5xl w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 text-xs text-white/60">
        <span>© {new Date().getFullYear()} Seedora</span>
        <div className="flex items-center gap-3">
          <button onClick={onPrivacy} className="hover:text-white transition-colors">Privacy</button>
          <button onClick={onTerms} className="hover:text-white transition-colors">Terms</button>
          <a href="mailto:support@seedora.com" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}

