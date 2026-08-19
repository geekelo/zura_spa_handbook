import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { LockedContent } from '../components/LockedContent'
import { saveForm, readForm } from '../data/forms'
import './FormTopic.css'
import './ArticleDetail.css'

export function SignTopic({ topic, backTo, locked = true }) {
  const existing = readForm(topic.id)
  const [agreed, setAgreed] = useState(Boolean(existing))
  const [fullName, setFullName] = useState(existing?.fullName || '')
  const [saved, setSaved] = useState(Boolean(existing))

  function handleSubmit(event) {
    event.preventDefault()
    saveForm(topic.id, {
      fullName,
      agreed: true,
      signedAt: new Date().toISOString(),
    })
    setSaved(true)
  }

  return (
    <div className="page sign-page">
      <PageHeader title={topic.title} backTo={backTo} />
      {topic.summary ? <p className="lead-copy">{topic.summary}</p> : null}

      <LockedContent locked={locked}>
        <div className="topic-body">
          {(topic.sections || []).map((section, index) => (
            <section key={section.title || index} className="topic-section">
              {section.title ? <h3>{section.title}</h3> : null}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        {saved ? <p className="sign-success">{topic.successMessage}</p> : null}

        <form className="sign-form" onSubmit={handleSubmit}>
          <label className="check-row">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              required
            />
            <span>{topic.agreementLabel}</span>
          </label>
          <label>
            Full name (signature)
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>
          <button type="submit">{topic.signLabel || 'Sign'}</button>
        </form>
      </LockedContent>
    </div>
  )
}
