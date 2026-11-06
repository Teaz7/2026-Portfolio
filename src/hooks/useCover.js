import { useLayoutEffect } from 'react'

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
