import { Link } from 'react-router-dom'
import { Icon } from './Icons'
import './CategoryCard.css'

const MODULE_TONES = [
  'rose',
  'mauve',
  'apricot',
  'lavender',
  'mint',
  'blush',
  'sand',
]

function moduleHeading(title) {
  const match = title?.match(/^Module\s+\d+\s*[—:\-]\s*(.+)$/i)
  return match?.[1] || title
}

export function ModuleCard({ item, to, index = 0 }) {
  const tone = MODULE_TONES[index % MODULE_TONES.length]
  const number = item.moduleNumber || index + 1

  return (
    <Link to={to} className={`category-card module-card tone-${tone}`}>
      <span className="module-card__badge" aria-hidden="true">
        {number}
      </span>
      <span className="category-card__copy">
        <strong>{moduleHeading(item.title)}</strong>
        <small>{item.summary}</small>
      </span>
      <Icon name="chevron" size={18} className="category-card__chevron" />
    </Link>
  )
}

export function CategoryCard({ category, to }) {
  return (
    <Link to={to} className={`category-card tone-${category.tone}`}>
      <span className="category-card__icon" aria-hidden="true">
        <Icon name={category.icon} size={20} />
      </span>
      <span className="category-card__copy">
        <strong>{category.title}</strong>
        <small>{category.description}</small>
      </span>
      <Icon name="chevron" size={18} className="category-card__chevron" />
    </Link>
  )
}
