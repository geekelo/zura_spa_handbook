/**
 * Loads handbook content from JSON folders.
 * Edit files in src/data/categories and src/data/journeys — not this file.
 */
import moreResources from './site/more-resources.json'
import updates from './site/updates.json'
import pages from './site/pages.json'
import homePaths from './site/home-paths.json'

const categoryModules = import.meta.glob('./categories/*/category.json', {
  eager: true,
  import: 'default',
})

const topicModules = import.meta.glob('./categories/*/topics/*.json', {
  eager: true,
  import: 'default',
})

const journeyModules = import.meta.glob('./journeys/*/journey.json', {
  eager: true,
  import: 'default',
})

const journeyTopicModules = import.meta.glob('./journeys/*/topics/*.json', {
  eager: true,
  import: 'default',
})

function categoryIdFromPath(path) {
  return path.match(/\/categories\/([^/]+)\//)?.[1]
}

function journeyIdFromPath(path) {
  return path.match(/\/journeys\/([^/]+)\//)?.[1]
}

function byOrder(a, b) {
  return (a.order ?? 99) - (b.order ?? 99)
}

function asList(value) {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

export const categories = Object.entries(categoryModules)
  .map(([path, data]) => ({
    ...data,
    id: data.id || categoryIdFromPath(path),
  }))
  .sort(byOrder)

const topicsByCategory = {}

for (const [path, data] of Object.entries(topicModules)) {
  const categoryId = categoryIdFromPath(path)
  if (!categoryId) continue
  if (!topicsByCategory[categoryId]) topicsByCategory[categoryId] = []
  topicsByCategory[categoryId].push(data)
}

for (const list of Object.values(topicsByCategory)) {
  list.sort(byOrder)
}

export const journeys = Object.entries(journeyModules)
  .map(([path, data]) => ({
    ...data,
    id: data.id || journeyIdFromPath(path),
  }))
  .sort(byOrder)

const topicsByJourney = {}

for (const [path, data] of Object.entries(journeyTopicModules)) {
  const journeyId = journeyIdFromPath(path)
  if (!journeyId) continue
  if (!topicsByJourney[journeyId]) topicsByJourney[journeyId] = []
  topicsByJourney[journeyId].push(data)
}

for (const list of Object.values(topicsByJourney)) {
  list.sort(byOrder)
}

export { moreResources, updates, pages, homePaths }

export function getCategory(id) {
  return categories.find((item) => item.id === id)
}

export function getTopics(categoryId) {
  return topicsByCategory[categoryId]
}

export function getTopic(categoryId, topicId) {
  return getTopics(categoryId)?.find((item) => item.id === topicId)
}

export function getJourney(id) {
  return journeys.find((item) => item.id === id)
}

export function getJourneyTopics(journeyId) {
  return topicsByJourney[journeyId]
}

export function getJourneyTopic(journeyId, topicId) {
  return getJourneyTopics(journeyId)?.find((item) => item.id === topicId)
}

/** @deprecated Use getTopics */
export const getArticles = getTopics
/** @deprecated Use getTopic */
export const getArticle = getTopic

export function searchHandbook(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results = []

  for (const category of categories) {
    if (
      category.title.toLowerCase().includes(q) ||
      category.description.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'category',
        id: category.id,
        title: category.title,
        description: category.description,
        to: `/categories/${category.id}`,
      })
    }

    for (const topic of getTopics(category.id) || []) {
      const stepMatch = topic.steps?.some(
        (step) =>
          step.title.toLowerCase().includes(q) ||
          step.body.toLowerCase().includes(q),
      )
      const sectionMatch = topic.sections?.some(
        (section) =>
          section.title?.toLowerCase().includes(q) ||
          section.paragraphs?.some((paragraph) =>
            paragraph.toLowerCase().includes(q),
          ) ||
          section.list?.some((item) => item.toLowerCase().includes(q)),
      )

      const extraSectionMatch = [...(topic.guidelines || []), ...(topic.notes || [])].some(
        (section) =>
          section.title?.toLowerCase().includes(q) ||
          section.paragraphs?.some((paragraph) =>
            paragraph.toLowerCase().includes(q),
          ) ||
          section.list?.some((item) => item.toLowerCase().includes(q)) ||
          section.items?.some(
            (item) =>
              item.label?.toLowerCase().includes(q) ||
              item.body?.toLowerCase().includes(q),
          ) ||
          section.closing?.toLowerCase().includes(q),
      )
      const procedureMatch = topic.procedure?.some((step) => {
        if (typeof step === 'string') return step.toLowerCase().includes(q)
        return (
          step.title?.toLowerCase().includes(q) ||
          step.body?.toLowerCase().includes(q) ||
          step.examples?.some((example) => example.toLowerCase().includes(q))
        )
      })
      const relevanceMatch = asList(topic.relevance).some((item) =>
        item.toLowerCase().includes(q),
      )

      if (
        topic.title.toLowerCase().includes(q) ||
        topic.summary?.toLowerCase().includes(q) ||
        topic.remember?.toLowerCase().includes(q) ||
        stepMatch ||
        sectionMatch ||
        extraSectionMatch ||
        procedureMatch ||
        relevanceMatch
      ) {
        results.push({
          type: topic.type,
          id: topic.id,
          title: topic.title,
          description: topic.summary,
          to: `/categories/${category.id}/${topic.id}`,
        })
      }
    }
  }

  for (const journey of journeys) {
    if (
      journey.title.toLowerCase().includes(q) ||
      journey.description.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'journey',
        id: journey.id,
        title: journey.title,
        description: journey.description,
        to: `/${journey.id}`,
      })
    }

    for (const topic of getJourneyTopics(journey.id) || []) {
      if (
        topic.title.toLowerCase().includes(q) ||
        topic.summary?.toLowerCase().includes(q)
      ) {
        results.push({
          type: topic.type,
          id: topic.id,
          title: topic.title,
          description: topic.summary,
          to: `/${journey.id}/${topic.id}`,
        })
      }
    }
  }

  return results
}
