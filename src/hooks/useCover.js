import { useLayoutEffect } from 'react'
import { INTRO_ENABLED } from '../utils/intro.js'

/*
  Sticky elements taller than the screen would have their bottom cut off while
  stuck at top: 0. This sets `top` so they scroll until their bottom reaches the
  bottom of the screen, then stick.
*/
export function useStickyFit(ref) {
  useLayoutEffect(() => {
    const element = ref.current
    const fit = () => {
      element.style.top = `${Math.min(0, window.innerHeight - element.offsetHeight)}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [ref])
}

/*
  Scroll-linked progress for a cover section: --enter goes 0 -> 1 over the first
  `distance` (fraction of the screen height) of scrolling after the section has
  covered the screen. Scrolling back up runs it in reverse.
*/
export function useCoverProgress(ref, distance) {
  useLayoutEffect(() => {
    const element = ref.current
    if (!INTRO_ENABLED) {
      element.style.setProperty('--enter', '1')
      return
    }
    const update = () => {
      const scrolled = -element.getBoundingClientRect().top / (window.innerHeight * distance)
      element.style.setProperty('--enter', Math.min(1, Math.max(0, scrolled)).toFixed(3))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref, distance])
}
