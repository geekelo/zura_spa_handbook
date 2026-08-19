import { NavLink } from 'react-router-dom'
import { Icon } from './Icons'
import './BottomNav.css'

const tabs = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/categories', label: 'Handbook', icon: 'grid' },
  { to: '/updates', label: 'Updates', icon: 'doc' },
  { to: '/more', label: 'More', icon: 'more' },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? ' is-active' : ''}`
          }
        >
          <Icon name={tab.icon} size={22} />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
