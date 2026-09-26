import { Link } from 'react-router-dom'
import { todaysTasks } from '../data'
import { PageHeader } from '../components/PageHeader'
import { LockedContent } from '../components/LockedContent'
import { Icon } from '../components/Icons'
import './Updates.css'
import './Home.css'

export function TodaysTasks() {
  return (
    <div className="page updates-page">
      <PageHeader title={todaysTasks.title} backTo="/categories" />

      <p className="lead-copy">{todaysTasks.lead}</p>

      <LockedContent>
        <div className="updates-stack">
          {todaysTasks.groups.map((group) => (
            <section key={group.id} className="section">
              <h2 className="section-label">{group.title}</h2>
              <div className="stack">
                {group.items.map((item) => {
                  const className = 'result-row'
                  const content = (
                    <>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </div>
                      <Icon name="chevron" size={18} />
                    </>
                  )

                  if (item.href) {
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        className={className}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content}
                      </a>
                    )
                  }

                  return (
                    <Link key={item.id} to={item.to} className={className}>
                      {content}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </LockedContent>
    </div>
  )
}
