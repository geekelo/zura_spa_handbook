import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, moreResources, searchHandbook } from '../data/handbook'
import { CategoryCard } from '../components/CategoryCard'
import { PageHeader } from '../components/PageHeader'
import { SearchBar } from '../components/SearchBar'
import { Icon } from '../components/Icons'
import './Categories.css'
import './Home.css'

export function Categories() {
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const results = useMemo(() => searchHandbook(query), [query])

  return (
    <div className="page categories-page">
      <PageHeader
        title="Categories"
        right={
          <button
            type="button"
            className="page-header__icon-btn"
            aria-label={showSearch ? 'Hide search' : 'Show search'}
            onClick={() => setShowSearch((value) => !value)}
          >
            <Icon name="search" size={20} />
          </button>
        }
      />

      {showSearch ? <SearchBar value={query} onChange={setQuery} /> : null}

      {showSearch && query.trim() ? (
        <section className="section">
          <h2 className="section-title">Search results</h2>
          <div className="stack">
            {results.length === 0 ? (
              <p className="empty-copy">No matches found.</p>
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
          <section className="section">
            <h2 className="section-label">Handbook Sections</h2>
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

          <section className="section">
            <h2 className="section-label">More Resources</h2>
            <div className="resource-list">
              {moreResources.map((item) => (
                <Link key={item.id} to={item.to} className="resource-row">
                  <span className="resource-row__icon" aria-hidden="true">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <span className="resource-row__copy">
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <Icon name="chevron" size={18} className="resource-row__chevron" />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
