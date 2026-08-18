import { Link } from 'react-router-dom'
import logo from '../assets/zura-logo.png'
import { pages } from '../data'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import './More.css'

export function More() {
  const copy = pages.more

  return (
    <div className="page more-page">
      <PageHeader title={copy.title} />

      <section className="more-brand">
        <img src={logo} alt={copy.brandName} className="more-brand__logo" />
        <div>
          <h2>{copy.brandName}</h2>
          <p>{copy.brandTagline}</p>
        </div>
      </section>

      <p className="lead-copy">{copy.lead}</p>

      <div className="help-list">
        {copy.links.map((item) => (
          <div key={item.title} className="help-row">
            <span className="help-row__icon" aria-hidden="true">
              <Icon name={item.icon} size={20} />
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
          </div>
        ))}
      </div>

      <Link to={copy.featured.to} className="featured-link">
        <span>
          <strong>{copy.featured.title}</strong>
          <small>{copy.featured.description}</small>
        </span>
        <Icon name="chevron" size={18} />
      </Link>

      <p className="more-footnote">{copy.footnote}</p>
    </div>
  )
}

export default More
