import { Navigate, useParams } from 'react-router-dom'
import {
  getCategory,
  getJourney,
  getJourneyGroupTopic,
  getJourneyGroupTopics,
  getJourneyTopic,
  getJourneyTopics,
  getTopic,
  getTopics,
} from '../data'
import ArticleDetail from './ArticleDetail'
import { FormTopic } from './FormTopic'
import { SignTopic } from './SignTopic'
import { EmploymentLetter } from './EmploymentLetter'
import { JourneyGroupDetail } from './CategoryDetail'

export function TopicPage({ journeyId }) {
  const { categoryId, articleId, nestedId } = useParams()

  if (journeyId && !nestedId) {
    const group = getJourneyTopic(journeyId, articleId)
    if (group?.type === 'group') {
      return <JourneyGroupDetail journeyId={journeyId} />
    }
  }

  const article = journeyId
    ? nestedId
      ? getJourneyGroupTopic(journeyId, articleId, nestedId)
      : getJourneyTopic(journeyId, articleId)
    : getTopic(categoryId, articleId)

  const parent = journeyId
    ? nestedId
      ? getJourneyTopic(journeyId, articleId)
      : getJourney(journeyId)
    : getCategory(categoryId)

  if (!parent || !article) {
    return (
      <Navigate
        to={
          journeyId
            ? nestedId
              ? `/${journeyId}/${articleId}`
              : `/${journeyId}`
            : '/categories'
        }
        replace
      />
    )
  }

  const backTo = journeyId
    ? nestedId
      ? `/${journeyId}/${articleId}`
      : `/${journeyId}`
    : `/categories/${categoryId}`
  const locked = journeyId !== 'apply'

  if (article.type === 'form') {
    return <FormTopic topic={article} backTo={backTo} locked={locked} />
  }

  if (article.type === 'sign') {
    return <SignTopic topic={article} backTo={backTo} locked={locked} />
  }

  if (article.type === 'employment-letter') {
    return <EmploymentLetter topic={article} backTo={backTo} locked={locked} />
  }

  const related = (
    (journeyId
      ? nestedId
        ? getJourneyGroupTopics(journeyId, articleId)
        : getJourneyTopics(journeyId)
      : getTopics(categoryId)) || []
  ).filter((item) => item.id !== article.id)

  const relatedBase = journeyId
    ? nestedId
      ? `/${journeyId}/${articleId}`
      : `/${journeyId}`
    : backTo

  return (
    <ArticleDetail
      category={parent}
      article={article}
      related={related}
      backTo={backTo}
      relatedBase={relatedBase}
      locked={locked}
    />
  )
}
