import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import Navbar from './Navbar.jsx'
import ContactSection from './ContactSection.jsx'
import Cursor from './Cursor.jsx'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Ease in-out for jumps (anchor links like #contact, project chips)
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Smooth scrolling (Lenis), same approach as yeahright.co
const lenisOptions = {
  lerp: 0.08, // mouse wheel smoothing: lower = slower, softer
  smoothWheel: !reduceMotion,
  anchors: { duration: 1.2, easing: easeInOutCubic },
}

// New page: start at the top, or jump to the #section in the link
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (hash) {
      lenis.scrollTo(hash, { duration: 1.2, easing: easeInOutCubic, immediate: reduceMotion })
    } else {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [lenis, pathname, hash])

  return null
}

// Shared page frame: navbar, page content, then the Contact section
function Layout() {
  return (
    <ReactLenis root options={lenisOptions}>
      <ScrollManager />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <ContactSection />
      <Cursor />
    </ReactLenis>
  )
}

export default Layout
