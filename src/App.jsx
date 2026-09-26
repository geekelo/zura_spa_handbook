import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import AppShell from './components/AppShell'
import { Home } from './pages/Home'
import { Categories } from './pages/Categories'
import { CategoryDetail, JourneyDetail } from './pages/CategoryDetail'
import { TopicPage } from './pages/TopicPage'
import { Updates } from './pages/Updates'
import { TodaysTasks } from './pages/TodaysTasks'
import { AssessmentOfTheDay } from './pages/AssessmentOfTheDay'
import { More } from './pages/More'
import { Login } from './pages/Login'
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
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:categoryId" element={<CategoryDetail />} />
            <Route
              path="categories/:categoryId/:articleId"
              element={<TopicPage />}
            />
            <Route path="apply" element={<JourneyDetail journeyId="apply" />} />
            <Route
              path="apply/:articleId"
              element={<TopicPage journeyId="apply" />}
            />
            <Route
              path="onboarding"
              element={<JourneyDetail journeyId="onboarding" />}
            />
            <Route
              path="onboarding/:articleId"
              element={<TopicPage journeyId="onboarding" />}
            />
            <Route
              path="courses"
              element={<JourneyDetail journeyId="courses" />}
            />
            <Route
              path="courses/:articleId"
              element={<TopicPage journeyId="courses" />}
            />
            <Route
              path="courses/:articleId/:nestedId"
              element={<TopicPage journeyId="courses" />}
            />
            <Route
              path="d-and-r"
              element={<JourneyDetail journeyId="d-and-r" />}
            />
            <Route
              path="d-and-r/:articleId"
              element={<TopicPage journeyId="d-and-r" />}
            />
            <Route path="todays-tasks" element={<TodaysTasks />} />
            <Route
              path="todays-tasks/assessment-of-the-day"
              element={<AssessmentOfTheDay />}
            />
            <Route path="updates" element={<Updates />} />
            <Route path="more" element={<More />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
