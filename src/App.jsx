import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import AppShell from './components/AppShell'
import { Home } from './pages/Home'
import { Categories } from './pages/Categories'
import { CategoryDetail } from './pages/CategoryDetail'
import ArticleDetail from './pages/ArticleDetail'
import { Updates } from './pages/Updates'
import { More } from './pages/More'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:categoryId" element={<CategoryDetail />} />
          <Route
            path="categories/:categoryId/:articleId"
            element={<ArticleDetail />}
          />
          <Route path="updates" element={<Updates />} />
          <Route path="more" element={<More />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
