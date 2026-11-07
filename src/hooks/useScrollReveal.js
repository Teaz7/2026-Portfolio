import { startTransition, useEffect, useRef, useState } from 'react'
import { INTRO_ENABLED, holdRevealsFor, revealWait } from '../utils/intro.js'
import { isPriorityScroll } from '../utils/scrollPriority.js'
import { isTransitionPending } from '../utils/pageTransition.js'

/*
  Scroll-triggered reveal that replays.
  - 'armed': content hidden, waiting
  - 'play': the element's top has reached `playAt` (fraction of the screen height
    from the top, e.g. 0.05 = top 5%)
  - back to 'armed' once you scroll up far enough that its top is below `resetAt`,
    so scrolling down again replays it. `run` changes on each reset, to restart
    things like typing (use it as a React key). `wait` (ms) is how long to hold
    off when it triggers while the page intro or a header is still animating.
  - 'done': reduced motion, everything just shows
  `enabled: false` turns it off (for components whose reveal is driven by a parent).
  `holdFor` (ms): when it plays, reveals below that come into view meanwhile wait
  until it's done instead of animating at the same time.
  `resetAtTop`: only reset once the page is scrolled all the way back to the top
  (scrolling up a little and down again keeps it as it is).
*/
export function useScrollReveal({
  playAt,
  resetAt,
  enabled = true,
  holdFor = 0,
  resetAtTop = false,
}) {
  const ref = useRef(null)
  const [reveal, setReveal] = useState({
    phase: INTRO_ENABLED ? 'armed' : 'done',
    run: 0,
    wait: 0,
  })

  useEffect(() => {
    if (!INTRO_ENABLED || !enabled) return
    const update = () => {
      // Not while scrolling to the top or while a page transition covers the page
      if (!ref.current || isPriorityScroll() || isTransitionPending()) return
      const rect = ref.current.getBoundingClientRect()
      const top = rect.top / window.innerHeight
      // Also play once it's entirely on screen: on tall screens the page can end
      // before a short section (like Contact) reaches its playAt point
      const reached = top <= playAt || (rect.top >= 0 && rect.bottom <= window.innerHeight + 1)
      // Resets (content already off-screen) run at low priority, so a batch of
      // them, e.g. after back to top, doesn't freeze a frame
      const resetting = resetAtTop ? window.scrollY <= 1 : top >= resetAt
      const apply = () =>
        setReveal((current) => {
          if (current.phase === 'armed' && reached) {
            const wait = revealWait()
            if (holdFor) holdRevealsFor(wait + holdFor, ref.current)
            return { ...current, phase: 'play', wait }
          }
          if (current.phase === 'play' && resetting) {
            return { phase: 'armed', run: current.run + 1, wait: 0 }
          }
          return current
        })
      if (resetting) startTransition(apply)
      else apply()
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [playAt, resetAt, enabled, holdFor, resetAtTop])

  return { ref, ...reveal }
}

// Inline animation delay for elements in a reveal
export const revealDelay = (ms) => ({ animationDelay: `${ms}ms` })
