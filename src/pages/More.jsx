import { Link } from 'react-router-dom'
import logo from '../assets/zura-logo.png'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import './More.css'

const links = [
  {
    title: 'Contact HR',
    description: 'Questions about policies, leave, or support.',
    icon: 'headset',
  },
  {
    title: 'Training calendar',
    description: 'Upcoming sessions and course deadlines.',
    icon: 'grad',
  },
  {
    title: 'Team announcements',
    description: 'House notes and spa-floor reminders.',
    icon: 'doc',
  },
]

export function More() {
  return (
    <div className="page more-page">
      <PageHeader title="More" />

      <section className="more-brand">
        <img src={logo} alt="Zura Spa" className="more-brand__logo" />
        <div>
          <h2>Zura Spa</h2>
          <p>Work Handbook · Internal guide for the floor team</p>
        </div>
      </section>

      <p className="lead-copy">
        Support, training, and extras beyond the core handbook.
      </p>

      <div className="help-list">
        {links.map((item) => (
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

      <Link to="/categories/scenarios" className="featured-link">
        <span>
          <strong>Browse scenarios</strong>
          <small>Common situations and how to handle them</small>
        </span>
        <Icon name="chevron" size={18} />
      </Link>

      <p className="more-footnote">Version 1.0 · For team use only</p>
    </div>
  )
}

export default More
