import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export default function AppShell() {
  return (
    <div className="app-frame">
      <div className="app-frame__content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
