import { Link, Navigate, useParams } from 'react-router-dom'
import { getArticle, getCategory, articles } from '../data/handbook'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icons'
import './ArticleDetail.css'

export default function ArticleDetail() {
  const { categoryId, articleId } = useParams()
  const category = getCategory(categoryId)
  const article = getArticle(categoryId, articleId)

  if (!category || !article) {
    return <Navigate to="/categories" replace />
  }

  const isScenario = article.type === 'scenario'
  const related = (articles[categoryId] || []).filter((item) => item.id !== article.id)

  return (
    <div className="page article-page">
      <PageHeader
        title={isScenario ? 'Scenario Detail' : category.title}
        backTo={`/categories/${categoryId}`}
      />

      <section className={`intro-card${isScenario ? ' intro-card--scenario' : ''}`}>
        <div className="intro-card__top">
          {isScenario ? (
            <span className="intro-card__avatar" aria-hidden="true">
              <Icon name="person" size={22} />
            </span>
          ) : null}
          <div className="intro-card__heading">
            <h2 className="intro-card__title">{article.title}</h2>
            {isScenario ? <span className="scenario-tag">Scenario</span> : null}
          </div>
        </div>
        <p>{article.summary}</p>
      </section>

      <section className="solution-block">
        <h3 className="solution-heading">
          <Icon name="lotus" size={18} />
          {isScenario ? 'Recommended Solution' : 'Key Points'}
        </h3>
        <p className="solution-lead">
          {isScenario
            ? 'Follow these steps to manage the situation with care and professionalism.'
            : 'Use these steps to stay consistent with Zura Spa standards.'}
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

      {article.remember ? (
        <aside className="remember-card">
          <Icon name="sprout" size={18} />
          <p>
            <strong>Remember:</strong> {article.remember}
          </p>
        </aside>
      ) : null}

      {related.length > 0 ? (
        <section className="related-block">
          <h3 className="section-label">More in {category.title}</h3>
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
