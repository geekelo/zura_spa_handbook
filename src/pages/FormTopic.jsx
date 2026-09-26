import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { LockedContent } from '../components/LockedContent'
import { AssessmentGate } from '../components/AssessmentGate'
import { useAuth } from '../auth/AuthContext'
import { saveForm, readForm } from '../data/forms'
import './FormTopic.css'
import './ArticleDetail.css'

function ContentSection({ section }) {
  return (
    <section className="topic-section">
      {section.title ? <h3>{section.title}</h3> : null}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.list?.length ? (
        <ul>
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.closing ? <p>{section.closing}</p> : null}
    </section>
  )
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

export function FormTopic({
  topic,
  backTo,
  locked = false,
  requireAssessmentAccess = false,
}) {
  const { isLoggedIn, hasAssessmentAccess } = useAuth()
  const canLoadEmbed = requireAssessmentAccess
    ? hasAssessmentAccess
    : !locked || isLoggedIn
  const existing = readForm(topic.id)
  const [values, setValues] = useState(() => {
    const start = {}
    for (const field of topic.fields || []) {
      start[field.name] = existing?.[field.name] || ''
    }
    return start
  })
  const [saved, setSaved] = useState(Boolean(existing))

  function handleSubmit(event) {
    event.preventDefault()
    saveForm(topic.id, values)
    setSaved(true)
  }

  const embed = topic.embedScript ? (
    canLoadEmbed ? (
      <ScriptEmbed src={topic.embedScript} title={topic.embedTitle || topic.title} />
    ) : (
      <div className="form-embed form-embed--placeholder" aria-hidden="true" />
    )
  ) : topic.embedUrl ? (
    <div className="form-embed">
      <iframe
        title={topic.embedTitle || topic.title}
        src={topic.embedUrl}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media"
      />
    </div>
  ) : null

  const body = (
    <>
      {topic.summary && requireAssessmentAccess ? (
        <p className="lead-copy">{topic.summary}</p>
      ) : null}
      {topic.sections?.length ? (
        <div className="topic-body">
          {topic.sections.map((section, index) => (
            <ContentSection key={section.title || index} section={section} />
          ))}
        </div>
      ) : null}

      {topic.documentUrl || topic.documentDownloadUrl ? (
        <div className="document-actions">
          {topic.documentUrl ? (
            <a
              href={topic.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="document-actions__link"
            >
              {topic.documentLabel || 'Open the assessment'}
            </a>
          ) : null}
          {topic.documentDownloadUrl ? (
            <a
              href={topic.documentDownloadUrl}
              className="document-actions__link document-actions__link--secondary"
            >
              {topic.documentDownloadLabel || 'Download'}
            </a>
          ) : null}
        </div>
      ) : null}

      {embed}

      {!embed ? (
        <>
          {saved ? <p className="form-success">{topic.successMessage}</p> : null}

          <form className="staff-form" onSubmit={handleSubmit}>
            {(topic.fields || []).map((field) => (
              <label key={field.name}>
                {field.label}
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    value={values[field.name]}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [field.name]: event.target.value,
                      }))
                    }
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    required={field.required}
                    value={values[field.name]}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [field.name]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select</option>
                    {(field.options || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    value={values[field.name]}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [field.name]: event.target.value,
                      }))
                    }
                  />
                )}
              </label>
            ))}
            <button type="submit">{topic.submitLabel || 'Submit'}</button>
          </form>
        </>
      ) : null}
    </>
  )

  return (
    <div className="page form-page">
      <PageHeader title={topic.title} backTo={backTo} />
      {topic.summary && !requireAssessmentAccess ? (
        <p className="lead-copy">{topic.summary}</p>
      ) : null}

      {requireAssessmentAccess ? (
        <AssessmentGate>{body}</AssessmentGate>
      ) : (
        <LockedContent locked={locked}>{body}</LockedContent>
      )}
    </div>
  )
}
