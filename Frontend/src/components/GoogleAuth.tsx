import { useEffect, useRef } from 'react'

type GoogleAuthProps = {
  clientId: string
  text?: 'signin_with' | 'signup_with' | 'continue_with'
  type?: 'standard' | 'icon'
  onCredential: (jwt: string) => void
}

declare global {
  interface Window {
    google?: any
  }
}

export default function GoogleAuth({ clientId, text = 'continue_with', type = 'standard', onCredential }: GoogleAuthProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!window.google || !buttonRef.current) return

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential: string }) => {
        onCredential(response.credential)
      },
      ux_mode: 'popup',
      context: 'signin',
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'filled_black',
      size: 'large',
      shape: 'pill',
      text,
      type,
      width: 320,
      logo_alignment: 'left',
    })

    return () => {
      try {
        window.google?.accounts.id.cancel()
      } catch {
        // ignore
      }
    }
  }, [clientId, onCredential, text, type])

  return (
    <div className="w-full flex items-center justify-center">
      <div ref={buttonRef} />
    </div>
  )
}


