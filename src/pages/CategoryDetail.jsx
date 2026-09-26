import { Link, Navigate, useParams } from 'react-router-dom'
import {
  getCategory,
  getJourney,
  getJourneyGroupTopics,
  getJourneyTopic,
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

export function JourneyGroupDetail({ journeyId }) {
  const { articleId: groupId } = useParams()
  const journey = getJourney(journeyId)
  const group = getJourneyTopic(journeyId, groupId)
  const items = getJourneyGroupTopics(journeyId, groupId)

  if (!journey || !group || group.type !== 'group' || !items?.length) {
    return <Navigate to={`/${journeyId}`} replace />
  }

  return (
    <div className="page category-detail-page">
      <PageHeader title={group.title} backTo={`/${journeyId}`} />

      <p className="lead-copy">{group.summary}</p>

      <div className="stack">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/${journeyId}/${groupId}/${item.id}`}
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

function TopicIndex({ journeyId }) {
  const { categoryId } = useParams()
  const parent = journeyId ? getJourney(journeyId) : getCategory(categoryId)
  const items = journeyId
    ? getJourneyTopics(journeyId)
    : getTopics(categoryId)
  const backTo = journeyId ? parent?.backTo || '/' : '/categories'

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
