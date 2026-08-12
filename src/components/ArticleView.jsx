import { Icon } from './Icons'
import './ArticleView.css'

export function ArticleView({ article }) {
  const isScenario = article.type === 'scenario'

  return (
    <div className="article-view">
      <section
        className={`overview-card${isScenario ? ' overview-card--scenario' : ''}`}
      >
        <div className="overview-card__top">
          <span className="overview-card__avatar" aria-hidden="true">
            <Icon name={isScenario ? 'person' : 'lotus'} size={22} />
          </span>
          <div>
            <h2>{article.title}</h2>
            {isScenario ? <span className="tag">Scenario</span> : null}
          </div>
        </div>
        <p>{article.summary}</p>
      </section>

      <section className="solution-block">
        <div className="solution-block__heading">
          <Icon name="lotus" size={18} />
          <h3>Recommended Solution</h3>
        </div>
        <p className="solution-block__intro">
          Follow these steps to manage the situation with care and professionalism.
        </p>

        <ol className="step-list">
          {article.steps.map((step, index) => (
            <li key={step.title} className="step-list__item">
              <span className="step-list__num">{index + 1}</span>
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
            <strong>Remember</strong> {article.remember}
          </p>
        </aside>
      ) : null}
    </div>
  )
}
