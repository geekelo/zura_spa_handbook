import { useEffect, useMemo, useRef, useState } from 'react'
import logo from '../assets/zura-logo.png'
import { PageHeader } from '../components/PageHeader'
import { AssessmentGate } from '../components/AssessmentGate'
import { saveForm, readForm } from '../data/forms'
import questionsBySection from '../data/site/lunez-assessment-questions.json'
import './EmploymentLetter.css'
import './FormTopic.css'
import './LunezAssessment.css'

function allQuestions() {
  return questionsBySection.flatMap((section) => section.questions)
}

function emptyValues() {
  const start = {
    realName: '',
    workName: '',
    date: new Date().toISOString().slice(0, 10),
  }
  for (const question of allQuestions()) {
    start[`q${question.id}Answer`] = ''
    start[`q${question.id}Reason`] = ''
  }
  return start
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function blank(value) {
  return value?.trim() ? escapeHtml(value.trim()) : '_______________________________'
}

function buildAssessmentHtml(values) {
  const name = blank(values.realName)
  const workName = blank(values.workName)
  const date = blank(values.date)

  const sectionsHtml = questionsBySection
    .map((section) => {
      const items = section.questions
        .map((question) => {
          const answer = blank(values[`q${question.id}Answer`])
          const reason = blank(values[`q${question.id}Reason`])
          return `<article class="q">
  <h3>${question.id}. ${escapeHtml(question.prompt)}</h3>
  <p><strong>Answer:</strong> ${answer}</p>
  <p><strong>Reason:</strong> ${reason}</p>
</article>`
        })
        .join('\n')
      return `<section>
  <h2>${escapeHtml(section.title)}</h2>
  ${items}
</section>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Lunez Massage Assessment — ${name}</title>
  <style>
    @page { margin: 16mm; }
    body {
      margin: 0;
      color: #1f1220;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 12.5px;
      line-height: 1.5;
      background: #fff;
    }
    .sheet { max-width: 760px; margin: 0 auto; padding: 8px 0; }
    .brand { text-align: center; border-bottom: 2px solid #6d2c40; padding-bottom: 14px; margin-bottom: 16px; }
    .brand img { width: 72px; height: auto; margin-bottom: 8px; }
    .brand h1 { margin: 0; font-size: 20px; letter-spacing: 0.06em; text-transform: uppercase; color: #6d2c40; }
    .brand p { margin: 6px 0 0; font-size: 12px; color: #7a5a62; }
    .meta p { margin: 0 0 6px; }
    h2 { margin: 22px 0 10px; font-size: 14px; color: #6d2c40; letter-spacing: 0.04em; }
    .q { margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid #eadfd8; }
    .q h3 { margin: 0 0 8px; font-size: 13px; }
    .q p { margin: 0 0 6px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand">
      <img src="${logo}" alt="Zura Spa" />
      <h1>Zura Spa</h1>
      <p>Lunez Massage Knowledge &amp; Application Assessment</p>
    </div>
    <div class="meta">
      <p><strong>Your real name:</strong> ${name}</p>
      <p><strong>Your work name:</strong> ${workName}</p>
      <p><strong>Date:</strong> ${date}</p>
    </div>
    <p>Purpose: To assess and reinforce whether a Zura Wellness Therapist understands the purpose, technique, timing, benefits, client expectation management, consent, hygiene, boundaries, safety and professional mindset required for Lunez Massage.</p>
    ${sectionsHtml}
  </div>
</body>
</html>`
}

function downloadBlob(filename, html) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function ScriptEmbed({ src, title }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || !src) return undefined
    host.replaceChildren()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.async = true
    host.appendChild(script)
    return () => {
      host.replaceChildren()
    }
  }, [src])

  return (
    <div
      className="form-embed form-embed--script"
      ref={hostRef}
      title={title}
      aria-label={title}
    />
  )
}

export function LunezAssessment({ topic, backTo }) {
  const existing = readForm(topic.id)
  const [values, setValues] = useState(() => ({
    ...emptyValues(),
    ...existing,
    date: existing?.date || new Date().toISOString().slice(0, 10),
  }))
  const [status, setStatus] = useState('')

  const setField = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }))

  const html = useMemo(() => buildAssessmentHtml(values), [values])

  function handleSave(event) {
    event?.preventDefault()
    saveForm(topic.id, values)
    setStatus('Your answers have been saved on this device.')
  }

  function handleDownload() {
    saveForm(topic.id, values)
    const slug = (values.workName || values.realName || 'therapist')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
    downloadBlob(`zura-lunez-assessment-${slug || 'therapist'}.html`, html)
    setStatus('Downloaded. Upload the file in the submission form below.')
  }

  return (
    <div className="page employment-letter-page lunez-assessment-page">
      <PageHeader title={topic.title} backTo={backTo} />

      <AssessmentGate>
        <p className="lead-copy">
          50 applied assessment questions. Kindly drop your answer and give
          your reasons, then download and upload the completed file.
        </p>

        <form className="el-card" onSubmit={handleSave}>
          <h2>Therapist details</h2>
          <div className="el-grid">
            <label>
              Your real name
              <input
                type="text"
                value={values.realName}
                onChange={(event) => setField('realName', event.target.value)}
                required
              />
            </label>
            <label>
              Your work name
              <input
                type="text"
                value={values.workName}
                onChange={(event) => setField('workName', event.target.value)}
                required
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={values.date}
                onChange={(event) => setField('date', event.target.value)}
                required
              />
            </label>
          </div>
        </form>

        {questionsBySection.map((section) => (
          <section key={section.title} className="el-card">
            <h2>{section.title}</h2>
            {section.questions.map((question) => (
              <div key={question.id} className="assessment-question">
                <p>
                  <strong>
                    {question.id}. {question.prompt}
                  </strong>
                </p>
                <label>
                  Answer
                  <textarea
                    value={values[`q${question.id}Answer`]}
                    onChange={(event) =>
                      setField(`q${question.id}Answer`, event.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  Reason
                  <textarea
                    value={values[`q${question.id}Reason`]}
                    onChange={(event) =>
                      setField(`q${question.id}Reason`, event.target.value)
                    }
                    required
                  />
                </label>
              </div>
            ))}
          </section>
        ))}

        <div className="el-card">
          <h2>Save and download</h2>
          <p className="lead-copy">
            Save your answers, download the completed assessment, then upload
            it in the submission form below.
          </p>
          {status ? <p className="form-success">{status}</p> : null}
          <div className="document-actions">
            <button type="button" className="document-actions__link" onClick={handleSave}>
              Save answers
            </button>
            <button
              type="button"
              className="document-actions__link document-actions__link--secondary"
              onClick={handleDownload}
            >
              Download assessment
            </button>
          </div>
        </div>

        <div className="el-card">
          <h2>Submit</h2>
          <p className="lead-copy">
            Upload your downloaded assessment using this form.
          </p>
          <ScriptEmbed
            src={topic.embedScript}
            title={topic.embedTitle || 'Assessment submission'}
          />
        </div>
      </AssessmentGate>
    </div>
  )
}
