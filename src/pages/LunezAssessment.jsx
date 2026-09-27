import { useEffect, useMemo, useRef, useState } from 'react'
import logo from '../assets/zura-logo.png'
import { PageHeader } from '../components/PageHeader'
import { AssessmentGate } from '../components/AssessmentGate'
import { saveForm, readForm } from '../data/forms'
import assessment1Questions from '../data/site/lunez-assessment-1-questions.json'
import assessment2Questions from '../data/site/lunez-assessment-2-questions.json'
import problemSolvingQuestions from '../data/site/problem-solving-assessment-questions.json'
import { downloadAssessmentPdf } from './assessmentPdf'
import './EmploymentLetter.css'
import './FormTopic.css'
import './LunezAssessment.css'

const QUESTION_SETS = {
  'lunez-assessment-1': assessment1Questions,
  'lunez-assessment-2': assessment2Questions,
  'problem-solving-mindset': problemSolvingQuestions,
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

function allQuestions(questionsBySection) {
  return questionsBySection.flatMap((section) => section.questions)
}

function emptyValues(questionsBySection) {
  const start = {
    realName: '',
    workName: '',
    date: new Date().toISOString().slice(0, 10),
  }
  for (const question of allQuestions(questionsBySection)) {
    start[`q${question.id}Answer`] = ''
    start[`q${question.id}Reason`] = ''
  }
  return start
}

function optionAnswerText(option, index) {
  const letter = OPTION_LETTERS[index] || String(index + 1)
  return `${letter}. ${option}`
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

export function LunezAssessment({ topic, backTo, accessKey }) {
  const formId = accessKey || topic.id
  const questionsBySection = QUESTION_SETS[topic.questionsId] || []
  const questionCount = useMemo(
    () => allQuestions(questionsBySection).length,
    [questionsBySection],
  )
  const [values, setValues] = useState(() => ({
    ...emptyValues(questionsBySection),
    ...readForm(formId),
    date: readForm(formId)?.date || new Date().toISOString().slice(0, 10),
  }))
  const [status, setStatus] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const existing = readForm(formId)
    setValues({
      ...emptyValues(questionsBySection),
      ...existing,
      date: existing?.date || new Date().toISOString().slice(0, 10),
    })
    setStatus('')
  }, [formId, questionsBySection])

  const setField = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }))

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveForm(formId, values)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [formId, values])

  function handleSave(event) {
    event?.preventDefault()
    saveForm(formId, values)
    setStatus('Your answers have been saved on this device.')
  }

  async function handleDownload() {
    saveForm(formId, values)
    setDownloading(true)
    setStatus('Preparing your PDF...')
    try {
      const slug = (values.workName || values.realName || 'therapist')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
      const fileKey = (accessKey || topic.id).replaceAll('/', '-')
      await downloadAssessmentPdf({
        logoSrc: logo,
        title: topic.title,
        purpose: topic.pdfPurpose
          ? `Purpose: ${topic.pdfPurpose}`
          : undefined,
        values,
        questionsBySection,
        filename: `zura-${fileKey}-${slug || 'therapist'}.pdf`,
      })
      setStatus('PDF downloaded. Upload the file in the submission form below.')
    } catch {
      setStatus('The PDF could not be created. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="page employment-letter-page lunez-assessment-page">
      <PageHeader title={topic.title} backTo={backTo} />

      <AssessmentGate accessKey={accessKey}>
        <p className="lead-copy">
          {questionCount} applied assessment questions. Tap an option to fill
          your answer, type your reason, then download a PDF and upload it.
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
                {question.options?.length ? (
                  <ol className="assessment-options">
                    {question.options.map((option, index) => {
                      const answerText = optionAnswerText(option, index)
                      const selected =
                        values[`q${question.id}Answer`] === answerText
                      return (
                        <li key={`${question.id}-${index}`}>
                          <button
                            type="button"
                            className={
                              selected
                                ? 'assessment-option assessment-option--selected'
                                : 'assessment-option'
                            }
                            onClick={() =>
                              setField(`q${question.id}Answer`, answerText)
                            }
                          >
                            <span>{OPTION_LETTERS[index] || index + 1}.</span>{' '}
                            {option}
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                ) : null}
                <label>
                  Answer
                  <textarea
                    value={values[`q${question.id}Answer`]}
                    readOnly
                    tabIndex={-1}
                    placeholder="Tap an option above to fill this answer"
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
            Save your answers, download the completed assessment as a PDF, then
            upload it in the submission form below.
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
              disabled={downloading}
            >
              {downloading ? 'Preparing PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="el-card">
          <h2>Submit</h2>
          <p className="lead-copy">
            Upload your downloaded PDF using this form.
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
