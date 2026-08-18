import { useEffect, useState } from 'react'
import { Icon } from './Icons'
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
  const [showIosHelp, setShowIosHelp] = useState(false)
  const [installed, setInstalled] = useState(() => isStandalone())

  useEffect(() => {
    function handlePrompt(event) {
      event.preventDefault()
      setInstallEvent(event)
    }

    function handleInstalled() {
      setInstalled(true)
      setInstallEvent(null)
      setShowIosHelp(false)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
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
    if (installEvent) {
      installEvent.prompt()
      const result = await installEvent.userChoice
      if (result.outcome === 'accepted') {
        setInstalled(true)
      }
      setInstallEvent(null)
      return
    }

    setShowIosHelp(true)
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
      <button type="button" onClick={handleInstall}>
        Download
      </button>
      {showIosHelp ? (
        <div className="install-help">
          {isIos() ? (
            <p>
              On iPhone or iPad, tap the <strong>Share</strong> button, then
              choose <strong>Add to Home Screen</strong>.
            </p>
          ) : (
            <p>
              Open this site in Chrome or Safari, then use the browser menu and
              choose <strong>Add to Home screen</strong> or{' '}
              <strong>Install app</strong>.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
