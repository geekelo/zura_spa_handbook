import { Link } from 'react-router-dom'
import { Icon } from './Icons'
import './PageHeader.css'

export function PageHeader({
  title,
  backTo,
  right,
  brand = false,
  logoSrc,
}) {
  return (
    <header className={`page-header${brand ? ' page-header--brand' : ''}`}>
      {backTo ? (
        <Link to={backTo} className="page-header__icon-btn" aria-label="Go back">
          <Icon name="back" size={22} />
        </Link>
      ) : brand ? (
        <Link to="/" className="brand-lockup" aria-label="Zura Spa Work Handbook home">
          <img src={logoSrc} alt="Zura Spa" className="brand-lockup__logo" />
          <span className="brand-lockup__text">
            <span className="brand-lockup__sub">Work Handbook</span>
          </span>
        </Link>
      ) : (
        <span className="page-header__spacer" />
      )}

      {!brand && title ? <h1 className="page-header__title">{title}</h1> : null}

      <div className="page-header__right">
        {right || <span className="page-header__spacer" />}
      </div>
    </header>
  )
}
