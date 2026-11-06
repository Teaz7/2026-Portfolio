import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { INTRO_ENABLED } from '../../utils/intro.js'
import { announceReveal, beginTransition } from '../../utils/pageTransition.js'
import './IntroOverlay.css'

/*
  The purple panel, used on a first load / refresh and between pages:
  - intro: sweeps in, holds, slides away (first load)
  - cover: clicking a link to another page sweeps it in from the right
  - hold: plain purple; the new page renders behind it (already at the top) and
    we wait for its fonts and on-screen images (at least MIN_HOLD, at most MAX_HOLD)
  - reveal: it slides away to the left and the new page's content animates in
*/
const MIN_HOLD = 200
const MAX_HOLD = 1500

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const nextFrames = () =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

// Fonts plus the images currently on screen
async function pageReady() {
  await nextFrames()
  const images = [...document.querySelectorAll('main img')].filter((image) => {
    const { top, bottom } = image.getBoundingClientRect()
    return bottom > 0 && top < window.innerHeight && !image.complete
  })
  await Promise.all([
    document.fonts.ready,
    ...images.map((image) => image.decode().catch(() => {})),
  ])
}

// Same-site link to a different page (not a #section on this one, a download, or a new tab)
function internalPath(event) {
  if (event.defaultPrevented || event.button !== 0) return null
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const link = event.target.closest('a[href]')
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return null
  const url = new URL(link.href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return null
  return url.pathname + url.search + url.hash
}

function PageTransition() {
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState(INTRO_ENABLED ? 'intro' : 'idle')
  const phaseRef = useRef(phase)
  const target = useRef(null)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  // Take over link clicks (capture phase, before React Router's own handling)
  useEffect(() => {
    if (!INTRO_ENABLED) return
    const onClick = (event) => {
      const path = internalPath(event)
      if (!path) return
      const current = phaseRef.current
      if (current === 'cover' || current === 'hold') {
        event.preventDefault()
        target.current = path // still covered: go to the latest link instead
      } else if (current === 'idle') {
        event.preventDefault()
        target.current = path
        beginTransition()
        phaseRef.current = 'cover'
        setPhase('cover')
      }
      // During the first-load intro or a reveal, the link just navigates normally
    }
    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [])

  // Covered: wait for the new page, then slide away
  useEffect(() => {
    if (phase !== 'hold') return
    let cancelled = false
    Promise.all([wait(MIN_HOLD), Promise.race([pageReady(), wait(MAX_HOLD)])]).then(() => {
      if (cancelled) return
      setPhase('reveal')
      announceReveal()
    })
    return () => {
      cancelled = true
    }
  }, [phase, location.key])

  const onAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) return
    if (phase === 'cover') {
      navigate(target.current)
      setPhase('hold')
    } else if (phase === 'intro' || phase === 'reveal') {
      setPhase('idle')
    }
  }

  if (phase === 'idle') return null
  return (
    <div
      className={`intro-overlay intro-overlay--${phase}`}
      aria-hidden="true"
      onAnimationEnd={onAnimationEnd}
    />
  )
}

export default PageTransition
