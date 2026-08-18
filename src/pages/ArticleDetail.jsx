import { Link, Navigate, useParams } from 'react-router-dom'
import { getCategory, getTopic, getTopics, pages } from '../data'
import { PageHeader } from '../components/PageHeader'
import { LockedContent } from '../components/LockedContent'
import { Icon } from '../components/Icons'
import './ArticleDetail.css'

function asList(value) {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

function ProcedureList({ procedure }) {
  return (
    <ol className="step-list">
      {procedure.map((step, index) => {
        const title = typeof step === 'string' ? step : step.title
        const body = typeof step === 'string' ? null : step.body
        const examples = typeof step === 'string' ? null : step.examples
        return (
          <li key={`${title}-${index}`} className="step-item">
            <span className="step-item__num">{index + 1}</span>
            <div>
              <strong>{title}</strong>
              {body ? <p>{body}</p> : null}
              {examples?.length ? (
                <ul className="example-list">
                  {examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function ContentSection({ section }) {
  return (
    <section className="topic-section">
      {section.title ? <h3>{section.title}</h3> : null}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.items?.length ? (
        <ul className="labeled-list">
          {section.items.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.body}
            </li>
          ))}
        </ul>
      ) : null}
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

export default function ArticleDetail() {
  const { categoryId, articleId } = useParams()
  const category = getCategory(categoryId)
  const article = getTopic(categoryId, articleId)

  if (!category || !article) {
    return <Navigate to="/categories" replace />
  }

  const isScenario = article.type === 'scenario'
  const isRoutine = article.type === 'routine'
  const related = (getTopics(categoryId) || []).filter((item) => item.id !== article.id)
  const relevance = asList(article.relevance)
  const procedure = asList(article.procedure)
  const guidelines = article.guidelines || []
  const notes = article.notes || []
  const hasRoutineBody = isRoutine
  const pageTitle = isScenario
    ? pages.article.scenarioPageTitle
    : isRoutine
      ? pages.article.routinePageTitle
      : category.title

  return (
    <div className="page article-page">
      <PageHeader title={pageTitle} backTo={`/categories/${categoryId}`} />

      <section
        className={`intro-card${isScenario ? ' intro-card--scenario' : ''}${
          isRoutine ? ' intro-card--routine' : ''
        }`}
      >
        <div className="intro-card__top">
          {isScenario || isRoutine ? (
            <span className="intro-card__avatar" aria-hidden="true">
              <Icon name={isRoutine ? 'repeat' : 'person'} size={22} />
            </span>
          ) : null}
          <div className="intro-card__heading">
            <h2 className="intro-card__title">{article.title}</h2>
            {isScenario ? (
              <span className="scenario-tag">{pages.article.scenarioTag}</span>
            ) : null}
            {isRoutine ? (
              <span className="scenario-tag">{pages.article.routineTag}</span>
            ) : null}
          </div>
        </div>
      </section>

      <LockedContent>
      {article.summary ? (
        <p className="locked-summary">{article.summary}</p>
      ) : null}
      {hasRoutineBody ? (
        <div className="topic-body">
          <section className="topic-section">
            <h3>{pages.article.relevanceHeading}</h3>
            {relevance.length ? (
              relevance.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p className="pending-copy">{pages.article.pendingCopy}</p>
            )}
          </section>
          {guidelines.map((section, index) => (
            <ContentSection key={section.title || index} section={section} />
          ))}
          <section className="topic-section">
            <h3>{pages.article.procedureHeading}</h3>
            {procedure.length ? (
              <ProcedureList procedure={procedure} />
            ) : (
              <p className="pending-copy">{pages.article.pendingCopy}</p>
            )}
          </section>
          {notes.map((section, index) => (
            <ContentSection key={section.title || index} section={section} />
          ))}
        </div>
      ) : article.sections?.length ? (
        <div className="topic-body">
          {article.sections.map((section, index) => (
            <ContentSection key={section.title || index} section={section} />
          ))}
        </div>
      ) : article.steps?.length ? (
        <section className="solution-block">
          <h3 className="solution-heading">
            <Icon name="lotus" size={18} />
            {isScenario
              ? pages.article.solutionHeading
              : pages.article.articleHeading}
          </h3>
          <p className="solution-lead">
            {isScenario ? pages.article.solutionLead : pages.article.articleLead}
          </p>

          <ol className="step-list">
            {article.steps.map((step, index) => (
              <li key={step.title} className="step-item">
                <span className="step-item__num">{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {article.remember ? (
        <aside className="remember-card">
          <Icon name="sprout" size={18} />
          <p>
            <strong>{pages.article.rememberLabel}</strong> {article.remember}
          </p>
        </aside>
      ) : null}
      </LockedContent>

      {related.length > 0 ? (
        <section className="related-block">
          <h3 className="section-label">
            {pages.article.relatedPrefix} {category.title}
          </h3>
          <div className="related-stack">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/categories/${categoryId}/${item.id}`}
                className="related-row"
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.summary}</small>
                </span>
                <Icon name="chevron" size={18} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
