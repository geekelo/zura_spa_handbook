import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export default function AppShell() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/login'

  return (
    <div className={`app-frame${hideNav ? ' app-frame--detail' : ''}`}>
      <div className="app-frame__content">
        <Outlet />
      </div>
      {hideNav ? null : <BottomNav />}
    </div>
  )
}
