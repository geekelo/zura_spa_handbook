import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  authenticate,
  clearSession,
  readSession,
  remainingSessionMs,
} from './session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession())

  useEffect(() => {
    const remaining = remainingSessionMs(session)
    if (!session || remaining <= 0) {
      if (session) {
        clearSession()
        setSession(null)
      }
      return undefined
    }

    const timer = window.setTimeout(() => {
      clearSession()
      setSession(null)
    }, remaining)

    return () => window.clearTimeout(timer)
  }, [session])

  useEffect(() => {
    function syncSession() {
      setSession(readSession())
    }

    window.addEventListener('storage', syncSession)
    window.addEventListener('focus', syncSession)
    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('focus', syncSession)
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      isLoggedIn: Boolean(session),
      login(username, password) {
        const next = authenticate(username, password)
        if (!next) return false
        setSession(next)
        return true
      },
      logout() {
        clearSession()
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
