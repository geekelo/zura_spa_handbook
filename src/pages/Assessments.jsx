import { Link, Navigate, useParams } from 'react-router-dom'
import { assessments, getAssessment, getAssessmentCategory } from '../data'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import { FormTopic } from './FormTopic'
import './Updates.css'
import './Home.css'
import './Categories.css'

export function Assessments() {
  return (
    <div className="page updates-page">
      <PageHeader title={assessments.title} backTo="/categories" />
      <p className="lead-copy">{assessments.lead}</p>
      <div className="stack">
        {assessments.categories.map((category) => (
          <Link
            key={category.id}
            to={`/assessments/${category.id}`}
            className="result-row"
          >
            <div>
              <strong>{category.title}</strong>
              <small>{category.description}</small>
            </div>
            <Icon name="chevron" size={18} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function AssessmentCategory() {
  const { categoryId } = useParams()
  const category = getAssessmentCategory(categoryId)

  if (!category) {
    return <Navigate to="/assessments" replace />
  }

  return (
    <div className="page updates-page">
      <PageHeader title={category.title} backTo="/assessments" />
      <p className="lead-copy">{category.description}</p>
      <div className="stack">
        {category.assessments.map((item) => (
          <Link
            key={item.id}
            to={`/assessments/${category.id}/${item.id}`}
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

export function AssessmentDetail() {
  const { categoryId, assessmentId } = useParams()
  const assessment = getAssessment(categoryId, assessmentId)

  if (!assessment) {
    return <Navigate to="/assessments" replace />
  }

  return (
    <FormTopic
      topic={assessment}
      backTo={`/assessments/${categoryId}`}
      requireAssessmentAccess
    />
  )
}
