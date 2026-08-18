import { Link, Navigate, useParams } from 'react-router-dom'
import { getCategory, getTopics } from '../data'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import './CategoryDetail.css'
import './Home.css'

export function CategoryDetail() {
  const { categoryId } = useParams()
  const category = getCategory(categoryId)
  const items = getTopics(categoryId)

  if (!category || !items) {
    return <Navigate to="/categories" replace />
  }

  return (
    <div className="page category-detail-page">
      <PageHeader title={category.title} backTo="/categories" />

      <p className="lead-copy">{category.description}</p>

      <div className="stack">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/categories/${categoryId}/${item.id}`}
            className="result-row"
          >
            <div>
              <strong>{item.title}</strong>
              <small>{item.summary}</small>
            </div>
            <Icon name="chevron" size={18} />
          </Link>
        ))}
      </div>
    </div>
  )
}
