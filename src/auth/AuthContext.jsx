import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  authenticate,
  clearSession,
  grantAssessmentAccess,
  readSession,
  readUnlockedAssessments,
  remainingSessionMs,
} from './session'
import { getAssessmentAccessCode } from '../data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession())
  const [unlockedKeys, setUnlockedKeys] = useState(() =>
    readUnlockedAssessments(),
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
      setUnlockedKeys(readUnlockedAssessments())
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

  const value = useMemo(
    () => ({
      session,
      isLoggedIn: Boolean(session),
      isAdmin,
      hasAssessmentAccess(accessKey) {
        return isAdmin || unlockedKeys.includes(accessKey)
      },
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
      restoreAssessmentAccess() {
        setUnlockedKeys(readUnlockedAssessments())
      },
      unlockAssessments(code, accessKey) {
        const expected = getAssessmentAccessCode(accessKey)
        if (!expected || code.trim() !== expected) return false
        setUnlockedKeys(grantAssessmentAccess(accessKey))
        return true
      },
    }),
    [session, isAdmin, unlockedKeys],
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
