import { Link, Navigate, useParams } from 'react-router-dom'
import {
  getCategory,
  getCourseGroupItems,
  getJourney,
  getJourneyTopic,
  getJourneyTopics,
  getTopics,
} from '../data'
import { CategoryCard, ModuleCard } from '../components/CategoryCard'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import './CategoryDetail.css'
import './Categories.css'
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
  const items = getCourseGroupItems(journeyId, groupId)
  const overview = items?.find((item) => item.kind === 'overview')
  const modules = items?.filter((item) => item.kind === 'module') || []
  const lessons = items?.filter((item) => item.kind === 'lesson') || []

  if (!journey || !group || group.type !== 'group' || !items?.length) {
    return <Navigate to={`/${journeyId}`} replace />
  }

  return (
    <div className="page category-detail-page">
      <PageHeader title={group.title} backTo={`/${journeyId}`} />

      <p className="lead-copy">{group.summary}</p>

      {overview ? (
        <section className="section">
          <CategoryCard
            category={{
              title: overview.title,
              description: overview.summary,
              icon: 'grad',
              tone: journey.tone || 'rose',
            }}
            to={`/${journeyId}/${groupId}/${overview.id}`}
          />
        </section>
      ) : null}

      {modules.length ? (
        <section className="section">
          <h2 className="section-label">
            {modules.length} {modules.length === 1 ? 'Module' : 'Modules'}
          </h2>
          <div className="stack">
            {modules.map((item, index) => (
              <ModuleCard
                key={item.id}
                item={item}
                index={index}
                to={`/${journeyId}/${groupId}/${item.id}`}
              />
            ))}
          </div>
        </section>
      ) : null}

      {lessons.length ? (
        <section className="section">
          <h2 className="section-label">Practice lessons</h2>
          <div className="stack">
            {lessons.map((item) => (
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
        </section>
      ) : null}
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
