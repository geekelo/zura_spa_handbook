import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './LockedContent.css'

export function AssessmentGate({ children }) {
  const { hasAssessmentAccess, isLoggedIn, isAdmin, unlockAssessments } =
    useAuth()
  const location = useLocation()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (hasAssessmentAccess) return children

  function handleSubmit(event) {
    event.preventDefault()
    const ok = unlockAssessments(code)
    if (!ok) {
      setError('That access code is not valid.')
    }
  }

  return (
    <div className="locked-content">
      <div className="locked-content__blur" aria-hidden="true">
        {children}
      </div>
      <div className="locked-content__overlay">
        <p>
          Assessment content is available to admin accounts, or with an access
          code.
        </p>
        {isLoggedIn && !isAdmin ? (
          <p className="locked-content__hint">
            You are signed in, but this account is not an admin.
          </p>
        ) : null}
        <form className="access-code-form" onSubmit={handleSubmit}>
          <label>
            Access code
            <input
              type="password"
              name="accessCode"
              value={code}
              onChange={(event) => {
                setCode(event.target.value)
                setError('')
              }}
              required
            />
          </label>
          {error ? <p className="login-error">{error}</p> : null}
          <button type="submit">Unlock</button>
        </form>
        {!isAdmin ? (
          <Link to="/login" state={{ from: location.pathname }}>
            Sign in as admin
          </Link>
        ) : null}
      </div>
    </div>
  )
}
