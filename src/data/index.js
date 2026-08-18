/**
 * Loads handbook content from category folders.
 * Edit JSON in src/data/categories — not this file.
 */
import moreResources from './site/more-resources.json'
import updates from './site/updates.json'
import pages from './site/pages.json'

const categoryModules = import.meta.glob('./categories/*/category.json', {
  eager: true,
  import: 'default',
})

const topicModules = import.meta.glob('./categories/*/topics/*.json', {
  eager: true,
  import: 'default',
})

function categoryIdFromPath(path) {
  return path.match(/\/categories\/([^/]+)\//)?.[1]
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

export { moreResources, updates, pages }

export function getCategory(id) {
  return categories.find((item) => item.id === id)
}

export function getTopics(categoryId) {
  return topicsByCategory[categoryId]
}

export function getTopic(categoryId, topicId) {
  return getTopics(categoryId)?.find((item) => item.id === topicId)
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

      const procedureMatch = topic.procedure?.some((step) => {
        if (typeof step === 'string') return step.toLowerCase().includes(q)
        return (
          step.title?.toLowerCase().includes(q) ||
          step.body?.toLowerCase().includes(q)
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

  return results
}
