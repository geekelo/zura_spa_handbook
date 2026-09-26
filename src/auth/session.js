import accounts from '../data/accounts.json'

export const SESSION_KEY = 'zura-spa-session'
export const SESSION_MS = 60 * 60 * 1000
export const ASSESSMENT_ACCESS_KEY = 'zura-spa-assessment-access'

export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const session = JSON.parse(raw)
    if (!session?.username || !session?.loggedInAt) {
      clearSession()
      return null
    }

    if (Date.now() - session.loggedInAt >= SESSION_MS) {
      clearSession()
      return null
    }

    return session
  } catch {
    clearSession()
    return null
  }
}

export function saveSession(account) {
  const session = {
    username: account.username,
    name: account.name || account.username,
    role: account.role || 'staff',
    loggedInAt: Date.now(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function authenticate(username, password) {
  const match = accounts.find(
    (account) =>
      account.username === username.trim() && account.password === password,
  )
  if (!match) return null
  return saveSession(match)
}

export function remainingSessionMs(session = readSession()) {
  if (!session) return 0
  return Math.max(0, SESSION_MS - (Date.now() - session.loggedInAt))
}

function storageRead(store) {
  try {
    return store.getItem(ASSESSMENT_ACCESS_KEY)
  } catch {
    return null
  }
}

function storageWrite(store, value) {
  try {
    if (value == null) store.removeItem(ASSESSMENT_ACCESS_KEY)
    else store.setItem(ASSESSMENT_ACCESS_KEY, value)
  } catch {
    // Private mode or quota can block storage; in-memory unlock still applies.
  }
}

function parseUnlockedKeys(raw) {
  if (!raw) return []
  if (raw === 'granted') return ['lunez-massage/knowledge-application']
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

export function readUnlockedAssessments() {
  const fromLocal = parseUnlockedKeys(storageRead(localStorage))
  const fromSession = parseUnlockedKeys(storageRead(sessionStorage))
  return [...new Set([...fromLocal, ...fromSession])]
}

export function isAssessmentAccessGranted(accessKey) {
  return Boolean(accessKey) && readUnlockedAssessments().includes(accessKey)
}

export function grantAssessmentAccess(accessKey) {
  if (!accessKey) return readUnlockedAssessments()
  const next = [...new Set([...readUnlockedAssessments(), accessKey])]
  const raw = JSON.stringify(next)
  storageWrite(localStorage, raw)
  storageWrite(sessionStorage, raw)
  return next
}

export function clearAssessmentAccess() {
  storageWrite(localStorage, null)
  storageWrite(sessionStorage, null)
}
