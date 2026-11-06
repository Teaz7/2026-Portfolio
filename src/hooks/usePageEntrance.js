import { useLayoutEffect, useRef, useState } from 'react'
import {
  INTRO_DELAY,
  INTRO_ENABLED,
  SWEEP_DURATION,
  holdRevealsFor,
  playsIntro,
} from '../utils/intro.js'

/*
  Page header entrance timing. Returns when the entrance should start (ms):
  after the purple sweep on a first load, or right away when navigating here.
  Scroll reveals already on screen (like the first section label) wait until the
  header's `duration` (ms) is over. null = no animation (reduced motion).
*/
export function usePageEntrance(duration = 0) {
  const [start] = useState(() => {
    if (!INTRO_ENABLED) return null
    return playsIntro() ? INTRO_DELAY : 100
  })

  useLayoutEffect(() => {
    if (start !== null) holdRevealsFor(start + duration)
  }, [start, duration])

  return start
}

/*
  "Dealing" offsets for a row of chips: each chip starts where the previous one sits,
  so they slide out from behind each other. Put the ref on the list; each <li> gets
  --deal-x / --deal-y (the first chip comes from `firstOffset` to its left).
*/
export function useDealOffsets(firstOffset = '-2rem') {
  const listRef = useRef(null)

  useLayoutEffect(() => {
    if (!listRef.current) return
    const items = [...listRef.current.children]
    items.forEach((item, index) => {
      const previous = items[index - 1]
      const x = previous ? `${previous.offsetLeft - item.offsetLeft}px` : firstOffset
      const y = previous ? `${previous.offsetTop - item.offsetTop}px` : '0px'
      item.style.setProperty('--deal-x', x)
      item.style.setProperty('--deal-y', y)
      item.style.zIndex = items.length - index // earlier chips cover the next one
    })
  }, [firstOffset])

  return listRef
}

/*
  Dark sections that already show at the bottom of the screen on a first load
  (e.g. About's history on shorter screens) start pushed below the screen, so the
  page under the purple sweep is plain white, then slide up once the sweep is gone.
*/
export function useIntroSlideUp(ref) {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || !INTRO_ENABLED || !playsIntro()) return
    const top = element.getBoundingClientRect().top
    if (top >= window.innerHeight) return

    element.style.setProperty('--slide-from', `${Math.ceil(window.innerHeight - top)}px`)
    element.style.setProperty('--slide-delay', `${SWEEP_DURATION}ms`)
    element.classList.add('intro-slide-up')
    const onEnd = (event) => {
      if (event.target !== element || event.animationName !== 'intro-slide-up') return
      element.classList.remove('intro-slide-up')
      element.removeEventListener('animationend', onEnd)
    }
    element.addEventListener('animationend', onEnd)
    return () => element.removeEventListener('animationend', onEnd)
  }, [ref])
}
