import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import About from './pages/About.jsx'
import Experiences from './pages/Experiences.jsx'

// Dev-only page for checking shared components; left out of production builds
const ComponentsPreview = import.meta.env.DEV
  ? lazy(() => import('./pages/ComponentsPreview.jsx'))
  : null

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="about" element={<About />} />
        <Route path="experiences" element={<Experiences />} />
        {ComponentsPreview && (
          <Route
            path="components"
            element={
              <Suspense>
                <ComponentsPreview />
              </Suspense>
            }
          />
        )}
      </Route>
    </Routes>
  )
}

export default App
