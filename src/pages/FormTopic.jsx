import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { LockedContent } from '../components/LockedContent'
import { saveForm, readForm } from '../data/forms'
import './FormTopic.css'

export function FormTopic({ topic, backTo, locked = false }) {
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

  return (
    <div className="page form-page">
      <PageHeader title={topic.title} backTo={backTo} />
      {topic.summary ? <p className="lead-copy">{topic.summary}</p> : null}

      <LockedContent locked={locked}>
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
      </LockedContent>
    </div>
  )
}
