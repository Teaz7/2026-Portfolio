import { useEffect, useRef, useState } from 'react'
import { INTRO_ENABLED, revealWait } from '../utils/intro.js'

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
*/
export function useScrollReveal({ playAt, resetAt, enabled = true }) {
  const ref = useRef(null)
  const [reveal, setReveal] = useState({
    phase: INTRO_ENABLED ? 'armed' : 'done',
    run: 0,
    wait: 0,
  })

  useEffect(() => {
    if (!INTRO_ENABLED || !enabled) return
    const update = () => {
      if (!ref.current) return
      const top = ref.current.getBoundingClientRect().top / window.innerHeight
      setReveal((current) => {
        if (current.phase === 'armed' && top <= playAt) {
          return { ...current, phase: 'play', wait: revealWait() }
        }
        if (current.phase === 'play' && top >= resetAt) {
          return { phase: 'armed', run: current.run + 1, wait: 0 }
        }
        return current
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [playAt, resetAt, enabled])

  return { ref, ...reveal }
}

// Inline animation delay for elements in a reveal
export const revealDelay = (ms) => ({ animationDelay: `${ms}ms` })
