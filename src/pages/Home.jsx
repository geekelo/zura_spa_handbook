import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/zura-logo.png'
import heroImage from '../assets/hero-spa.png'
import { categories, pages, searchHandbook } from '../data'
import { CategoryCard } from '../components/CategoryCard'
import { PageHeader } from '../components/PageHeader'
import { SearchBar } from '../components/SearchBar'
import { Icon } from '../components/Icons'
import './Home.css'

export function Home() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchHandbook(query), [query])

  return (
    <div className="page home-page">
      <PageHeader
        brand
        logoSrc={logo}
        right={
          <Link to="/updates" className="page-header__icon-btn" aria-label="Notifications">
            <Icon name="bell" size={20} />
          </Link>
        }
      />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={pages.search.placeholder}
      />

      {query.trim() ? (
        <section className="section">
          <h2 className="section-title">{pages.search.resultsTitle}</h2>
          <div className="stack">
            {results.length === 0 ? (
              <p className="empty-copy">
                {pages.home.searchEmpty.replace('{query}', query)}
              </p>
            ) : (
              results.map((item) => (
                <Link key={`${item.type}-${item.id}`} to={item.to} className="result-row">
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </div>
                  <Icon name="chevron" size={18} />
                </Link>
              ))
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="hero-card" aria-label="Welcome">
            <div className="hero-card__copy">
              <h2>{pages.home.heroTitle}</h2>
              <p>{pages.home.heroBody}</p>
            </div>
            <div className="hero-card__media">
              <img src={heroImage} alt={pages.home.heroImageAlt} />
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">{pages.home.exploreTitle}</h2>
            <div className="stack">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  to={`/categories/${category.id}`}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
