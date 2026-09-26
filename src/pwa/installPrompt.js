let deferredPrompt = null
const listeners = new Set()

function notify() {
  for (const listener of listeners) listener(deferredPrompt)
}

export function initInstallPromptCapture() {
  if (typeof window === 'undefined') return

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    notify()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })
}

export function getDeferredPrompt() {
  return deferredPrompt
}

export function clearDeferredPrompt() {
  deferredPrompt = null
  notify()
}

export function subscribeInstallPrompt(listener) {
  listeners.add(listener)
  listener(deferredPrompt)
  return () => listeners.delete(listener)
}
