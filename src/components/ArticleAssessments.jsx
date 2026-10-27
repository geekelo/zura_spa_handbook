import { Link } from 'react-router-dom'
import { pages } from '../data'
import { Icon } from './Icons'
import '../pages/ArticleDetail.css'

export function ArticleAssessments({ items }) {
  if (!items?.length) return null

  return (
    <section className="related-block related-block--assessments">
      <h3 className="section-label">{pages.article.assessmentsHeading}</h3>
      <div className="related-stack">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="related-row related-row--assessment">
            <span className="related-row__icon" aria-hidden="true">
              <Icon name="clipboard" size={20} />
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.summary}</small>
            </span>
            <span className="related-row__action">
              {pages.article.assessmentsAction}
              <Icon name="chevron" size={18} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
