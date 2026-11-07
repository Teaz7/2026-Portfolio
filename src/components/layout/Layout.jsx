import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import Navbar from './Navbar.jsx'
import ContactSection from './ContactSection.jsx'
import Cursor from './Cursor.jsx'
import PageTransition from '../intro/PageTransition.jsx'
import ScrollTopButton from './ScrollTopButton.jsx'
import { leaveFirstPage } from '../../utils/intro.js'
import { easeInOutCubic, reduceMotion } from './scrolling.js'
import { priorityScrollTo } from '../../utils/scrollPriority.js'

// Smooth scrolling (Lenis), same approach as yeahright.co
const lenisOptions = {
  lerp: 0.08, // mouse wheel smoothing: lower = slower, softer
  smoothWheel: !reduceMotion,
}

// New page: start at the top, or jump to the #section in the link
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()
  const firstPath = useRef(pathname)

  // The page-load intro only plays on the first page visited
  useEffect(() => {
    if (pathname !== firstPath.current) leaveFirstPage()
  }, [pathname])

  useEffect(() => {
    if (!lenis) return
    if (hash) {
      priorityScrollTo(lenis, hash, { duration: 1.2, easing: easeInOutCubic, immediate: reduceMotion })
    } else {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [lenis, pathname, hash])

  // Same-page #links (navbar Contact, jump chips) glide there with priority too
  useEffect(() => {
    if (!lenis) return
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]')
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return
      event.preventDefault()
      priorityScrollTo(lenis, target, { duration: 1.2, easing: easeInOutCubic, immediate: reduceMotion })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

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
      <ScrollTopButton />
      <PageTransition />
      <Cursor />
    </ReactLenis>
  )
}

export default Layout
