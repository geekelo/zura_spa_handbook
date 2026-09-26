import { jsPDF } from 'jspdf'

const MAROON = [109, 44, 64]
const INK = [31, 18, 32]
const MUTED = [122, 90, 98]
const LETTERS = ['A', 'B', 'C', 'D']

function plain(value) {
  return String(value || '')
    .replaceAll('\u2018', "'")
    .replaceAll('\u2019', "'")
    .replaceAll('\u201C', '"')
    .replaceAll('\u201D', '"')
    .replaceAll('\u2014', '-')
    .replaceAll('\u2013', '-')
}

function filled(value) {
  return value?.trim() ? plain(value.trim()) : '_______________________________'
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load logo'))
    image.src = src
  })
}

async function logoPayload(src) {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  canvas.getContext('2d').drawImage(image, 0, 0)
  return {
    dataUrl: canvas.toDataURL('image/png'),
    ratio: image.naturalWidth / image.naturalHeight,
  }
}

export async function downloadAssessmentPdf({
  logoSrc,
  title,
  values,
  questionsBySection,
  filename,
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = 210
  const pageHeight = 297
  const margin = 16
  const maxWidth = pageWidth - margin * 2
  let y = margin

  function ensure(space) {
    if (y + space <= pageHeight - margin) return
    doc.addPage()
    y = margin
  }

  function write(text, { size = 11, style = 'normal', color = INK, gap = 1.2 } = {}) {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(plain(text), maxWidth)
    const lineHeight = size * 0.45
    for (const line of lines) {
      ensure(lineHeight + 1)
      doc.text(line, margin, y)
      y += lineHeight
    }
    y += gap
  }

  try {
    const logo = await logoPayload(logoSrc)
    const logoHeight = 18
    const logoWidth = logoHeight * logo.ratio
    ensure(logoHeight + 8)
    doc.addImage(
      logo.dataUrl,
      'PNG',
      (pageWidth - logoWidth) / 2,
      y,
      logoWidth,
      logoHeight,
    )
    y += logoHeight + 6
  } catch {
    y += 2
  }

  doc.setDrawColor(...MAROON)
  write('ZURA SPA', { size: 16, style: 'bold', color: MAROON, gap: 2 })
  write(title, { size: 12, style: 'bold', color: MUTED, gap: 4 })
  doc.setLineWidth(0.6)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  write(`Your real name: ${filled(values.realName)}`, { size: 11, style: 'bold' })
  write(`Your work name: ${filled(values.workName)}`, { size: 11, style: 'bold' })
  write(`Date: ${filled(values.date)}`, { size: 11, style: 'bold', gap: 4 })
  write(
    'Purpose: To assess whether a Zura Wellness Therapist understands the purpose, technique, timing, benefits, client expectation management, consent, hygiene, boundaries, safety and professional mindset required for Lunez Massage.',
    { size: 10, color: MUTED, gap: 6 },
  )

  for (const section of questionsBySection) {
    write(section.title, { size: 12, style: 'bold', color: MAROON, gap: 4 })
    for (const question of section.questions) {
      write(`${question.id}. ${question.prompt}`, { size: 11, style: 'bold', gap: 2 })
      for (const [index, option] of (question.options || []).entries()) {
        write(`${LETTERS[index] || index + 1}. ${option}`, { size: 10, gap: 1.2 })
      }
      write(`Answer: ${filled(values[`q${question.id}Answer`])}`, {
        size: 10,
        style: 'bold',
        gap: 1.5,
      })
      write(`Reason: ${filled(values[`q${question.id}Reason`])}`, {
        size: 10,
        gap: 5,
      })
    }
  }

  doc.save(filename)
}
