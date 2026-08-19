import { Link, Navigate, useParams } from 'react-router-dom'
import {
  getCategory,
  getJourney,
  getJourneyTopics,
  getTopics,
} from '../data'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import './CategoryDetail.css'
import './Home.css'

export function CategoryDetail() {
  return <TopicIndex />
}

export function JourneyDetail({ journeyId }) {
  return <TopicIndex journeyId={journeyId} />
}

function TopicIndex({ journeyId }) {
  const { categoryId } = useParams()
  const parent = journeyId ? getJourney(journeyId) : getCategory(categoryId)
  const items = journeyId
    ? getJourneyTopics(journeyId)
    : getTopics(categoryId)
  const backTo = journeyId ? '/' : '/categories'

  if (!parent || !items) {
    return <Navigate to={journeyId ? '/' : '/categories'} replace />
  }

  return (
    <div className="page category-detail-page">
      <PageHeader title={parent.title} backTo={backTo} />

      <p className="lead-copy">{parent.description}</p>

      <div className="stack">
        {items.map((item) => (
          <Link
            key={item.id}
            to={
              journeyId
                ? `/${journeyId}/${item.id}`
                : `/categories/${categoryId}/${item.id}`
            }
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
