import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import logo from '../assets/zura-logo.png'
import { useAuth } from '../auth/AuthContext'
import { PageHeader } from '../components/PageHeader'
import './Login.css'

export function Login() {
  const { isLoggedIn, login } = useAuth()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isLoggedIn) {
    return <Navigate to={from} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    const ok = login(username, password)
    if (!ok) {
      setError('Those details do not match an existing account.')
    }
  }

  return (
    <div className="page login-page">
      <PageHeader title="Sign in" backTo="/" />

      <section className="login-brand">
        <img src={logo} alt="Zura Spa" />
        <p>Staff handbook access</p>
      </section>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              setError('')
            }}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            required
          />
        </label>
        {error ? <p className="login-error">{error}</p> : null}
        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}
