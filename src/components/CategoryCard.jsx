import { Link } from 'react-router-dom'
import { Icon } from './Icons'
import './CategoryCard.css'

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
