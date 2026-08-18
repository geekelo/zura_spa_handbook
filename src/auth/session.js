import accounts from '../data/accounts.json'

export const SESSION_KEY = 'zura-spa-session'
export const SESSION_MS = 60 * 60 * 1000

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
