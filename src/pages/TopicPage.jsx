import { Navigate, useParams } from 'react-router-dom'
import {
  getCategory,
  getJourney,
  getCourseGroupItems,
  resolveJourneyGroupTopic,
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

function relatedItems({ journeyId, categoryId, groupId, article }) {
  if (journeyId && groupId) {
    const items = getCourseGroupItems(journeyId, groupId) || []
    if (article.kind === 'module') {
      return items.filter((item) => item.kind === 'module' && item.id !== article.id)
    }
    if (article.kind === 'module-reading' || article.module) {
      return items.filter(
        (item) =>
          item.kind === 'module-reading' &&
          Number(item.module) === Number(article.module) &&
          item.id !== article.id,
      )
    }
    return items.filter(
      (item) => item.id !== article.id && item.kind !== 'module-reading',
    )
  }

  const list = journeyId ? getJourneyTopics(journeyId) : getTopics(categoryId)
  return (list || []).filter((item) => item.id !== article.id)
}

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
      ? resolveJourneyGroupTopic(journeyId, articleId, nestedId)
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
      ? article.module
        ? `/${journeyId}/${articleId}/module-${article.module}`
        : `/${journeyId}/${articleId}`
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

  const related = relatedItems({
    journeyId,
    categoryId,
    groupId: nestedId ? articleId : undefined,
    article,
  })

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
      relatedTitle={
        article.module
          ? `More Day ${article.module} lessons`
          : article.kind === 'module'
            ? `More days in ${parent.title}`
            : undefined
      }
      locked={locked}
      journeyId={journeyId}
      groupId={nestedId ? articleId : undefined}
    />
  )
}
