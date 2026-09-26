import { useEffect, useState } from 'react'
import { Icon } from './Icons'
import {
  clearDeferredPrompt,
  subscribeInstallPrompt,
} from '../pwa/installPrompt'
import './InstallAppButton.css'

function isIos() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function InstallAppButton() {
  const [installEvent, setInstallEvent] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [installed, setInstalled] = useState(() => isStandalone())
  const [busy, setBusy] = useState(false)
  const ios = isIos()

  useEffect(() => {
    const unsubscribe = subscribeInstallPrompt(setInstallEvent)

    function handleInstalled() {
      setInstalled(true)
      setShowHelp(false)
      clearDeferredPrompt()
    }

    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      unsubscribe()
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  if (installed) {
    return (
      <div className="install-card is-installed">
        <span className="install-card__icon" aria-hidden="true">
          <Icon name="download" size={20} />
        </span>
        <span>
          <strong>Saved on this device</strong>
          <small>Open it from your home screen like an app.</small>
        </span>
      </div>
    )
  }

  async function handleInstall() {
    if (busy) return

    if (installEvent) {
      setBusy(true)
      try {
        await installEvent.prompt()
        const result = await installEvent.userChoice
        if (result.outcome === 'accepted') {
          setInstalled(true)
        }
        clearDeferredPrompt()
      } catch {
        setShowHelp(true)
      } finally {
        setBusy(false)
      }
      return
    }

    setShowHelp(true)
  }

  return (
    <div className="install-card">
      <span className="install-card__icon" aria-hidden="true">
        <Icon name="download" size={20} />
      </span>
      <span>
        <strong>Save as an app</strong>
        <small>Add the handbook to your home screen for quick access.</small>
      </span>
      <button type="button" onClick={handleInstall} disabled={busy}>
        {busy ? 'Opening…' : 'Download'}
      </button>
      {showHelp || ios ? (
        <div className="install-help">
          {ios ? (
            <p>
              On iPhone or iPad, tap the <strong>Share</strong> button, then
              choose <strong>Add to Home Screen</strong>. Safari cannot install
              the app from this Download button.
            </p>
          ) : (
            <p>
              If no install popup appears, open this site in Chrome, tap the
              browser menu, then choose <strong>Install app</strong> or{' '}
              <strong>Add to Home screen</strong>.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
