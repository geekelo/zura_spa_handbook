function push(parts, value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text) parts.push(text)
}

function collectSection(section, parts) {
  if (section?.title === 'Standards-review assignment') return
  push(parts, section?.title)
  for (const paragraph of section?.paragraphs || []) push(parts, paragraph)
  for (const item of section?.items || []) {
    push(parts, item.label)
    push(parts, item.body)
  }
  for (const item of section?.list || []) push(parts, item)
  if (section?.tableHeaders?.length && section?.table?.length) {
    for (const row of section.table) {
      const cells = row.map((cell, index) => {
        const header = section.tableHeaders[index]
        return header ? `${header}: ${cell}` : cell
      })
      push(parts, cells.join('. '))
    }
  }
  push(parts, section?.closing)
}

export function articleListenText(article) {
  if (!article) return ''
  const parts = []
  push(parts, article.title)
  push(parts, article.summary)

  for (const section of article.sections || []) collectSection(section, parts)
  for (const section of article.guidelines || []) collectSection(section, parts)
  for (const section of article.notes || []) collectSection(section, parts)

  const relevance = Array.isArray(article.relevance)
    ? article.relevance
    : article.relevance
      ? [article.relevance]
      : []
  if (relevance.length) {
    push(parts, 'Relevance')
    relevance.forEach((item) => push(parts, item))
  }

  const procedure = Array.isArray(article.procedure)
    ? article.procedure
    : article.procedure
      ? [article.procedure]
      : []
  if (procedure.length) {
    push(parts, 'Procedure')
    procedure.forEach((step, index) => {
      const title = typeof step === 'string' ? step : step.title
      const body = typeof step === 'string' ? '' : step.body
      push(parts, `${index + 1}. ${title}`)
      push(parts, body)
    })
  }

  for (const [index, step] of (article.steps || []).entries()) {
    push(parts, `${index + 1}. ${step.title}`)
    push(parts, step.body)
  }

  if (article.remember) {
    push(parts, 'Remember')
    push(parts, article.remember)
  }

  return parts.join('. ')
}

export function chunkListenText(text) {
  const sentences = String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
  const chunks = []
  let current = ''
  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence
    if (next.length > 240 && current) {
      chunks.push(current)
      current = sentence
    } else {
      current = next
    }
  }
  if (current) chunks.push(current)
  return chunks
}

export function pickEnglishVoice(voices) {
  const list = Array.from(voices || [])
  return (
    list.find((voice) => /en-NG/i.test(voice.lang)) ||
    list.find((voice) => /en-GB/i.test(voice.lang)) ||
    list.find((voice) => /en-US/i.test(voice.lang)) ||
    list.find((voice) => /^en/i.test(voice.lang)) ||
    list[0] ||
    null
  )
}
