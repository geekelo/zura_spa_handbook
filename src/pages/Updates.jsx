import { Link } from 'react-router-dom'
import { updates } from '../data/handbook'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import './Updates.css'

export function Updates() {
  return (
    <div className="page updates-page">
      <PageHeader title="Updates" />

      <p className="lead-copy">
        Latest changes to policies, procedures, and scenario guidance.
      </p>

      <div className="updates-stack">
        {updates.map((item) => (
          <Link key={item.id} to={item.to} className="update-card">
            <div className="update-card__meta">
              <Icon name="doc" size={16} />
              <time>{item.date}</time>
            </div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
