import { Navigate, useParams } from 'react-router-dom'
import {
  getCategory,
  getJourney,
  getJourneyTopic,
  getJourneyTopics,
  getTopic,
  getTopics,
} from '../data'
import ArticleDetail from './ArticleDetail'
import { FormTopic } from './FormTopic'
import { SignTopic } from './SignTopic'

export function TopicPage({ journeyId }) {
  const { categoryId, articleId } = useParams()
  const article = journeyId
    ? getJourneyTopic(journeyId, articleId)
    : getTopic(categoryId, articleId)
  const parent = journeyId ? getJourney(journeyId) : getCategory(categoryId)

  if (!parent || !article) {
    return <Navigate to={journeyId ? `/${journeyId}` : '/categories'} replace />
  }

  const backTo = journeyId ? `/${journeyId}` : `/categories/${categoryId}`
  const locked = journeyId !== 'apply'

  if (article.type === 'form') {
    return <FormTopic topic={article} backTo={backTo} locked={locked} />
  }

  if (article.type === 'sign') {
    return <SignTopic topic={article} backTo={backTo} locked={locked} />
  }

  const related = (
    (journeyId ? getJourneyTopics(journeyId) : getTopics(categoryId)) || []
  ).filter((item) => item.id !== article.id)

  return (
    <ArticleDetail
      category={parent}
      article={article}
      related={related}
      backTo={backTo}
      relatedBase={backTo}
      locked={locked}
    />
  )
}
