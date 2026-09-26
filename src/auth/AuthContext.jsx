import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  authenticate,
  clearSession,
  grantAssessmentAccess,
  readAssessmentAccess,
  readSession,
  remainingSessionMs,
} from './session'
import { assessments } from '../data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession())
  const [assessmentUnlocked, setAssessmentUnlocked] = useState(() =>
    readAssessmentAccess(),
  )

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
      setAssessmentUnlocked(readAssessmentAccess())
    }

    window.addEventListener('storage', syncSession)
    window.addEventListener('focus', syncSession)
    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('focus', syncSession)
    }
  }, [])

  const isAdmin =
    session?.role === 'admin' || session?.username === 'admin'
  const hasAssessmentAccess = isAdmin || assessmentUnlocked

  const value = useMemo(
    () => ({
      session,
      isLoggedIn: Boolean(session),
      isAdmin,
      hasAssessmentAccess,
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
      unlockAssessments(code) {
        const expected = assessments.accessCode?.trim()
        if (!expected || code.trim() !== expected) return false
        grantAssessmentAccess()
        setAssessmentUnlocked(true)
        return true
      },
    }),
    [session, isAdmin, hasAssessmentAccess],
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
