import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './LockedContent.css'

export function LockedContent({ children, locked = true }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!locked || isLoggedIn) return children

  return (
    <div className="locked-content">
      <div className="locked-content__blur" aria-hidden="true">
        {children}
      </div>
      <div className="locked-content__overlay">
        <p>Sign in to read this handbook content.</p>
        <Link to="/login" state={{ from: location.pathname }}>
          Sign in
        </Link>
      </div>
    </div>
  )
}
