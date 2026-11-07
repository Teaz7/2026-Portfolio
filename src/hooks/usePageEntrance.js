import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  INTRO_DELAY,
  INTRO_ENABLED,
  SWEEP_DURATION,
  holdRevealsFor,
  playsIntro,
} from '../utils/intro.js'
import { REVEAL_LEAD, isTransitionPending, onReveal } from '../utils/pageTransition.js'

/*
  Page header entrance timing. Returns when the entrance should start (ms):
  after the purple sweep on a first load, or as the purple panel slides away after
  a page transition. While the panel still covers the page it's null (content just
  sits there, unseen). Scroll reveals already on screen (like the first section
  label) wait until the header's `duration` (ms) is over. null = no animation.
*/
export function usePageEntrance(duration = 0) {
  const [start, setStart] = useState(() => {
    if (!INTRO_ENABLED || isTransitionPending()) return null
    return playsIntro() ? INTRO_DELAY : 100
  })

  // Rendered under the transition panel: start as it slides away
  useEffect(() => {
    if (!INTRO_ENABLED || !isTransitionPending()) return
    return onReveal(() => setStart(REVEAL_LEAD))
  }, [])

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
  Dark sections that already show at the bottom of the screen when a page appears
  (e.g. About's history on shorter screens) start pushed below the screen, so the
  page under the purple panel is plain white, then slide up once the panel is gone:
  after the first-load sweep, or as the panel slides away after a page transition.
*/
export function useIntroSlideUp(ref) {
  useLayoutEffect(() => {
    const element = ref.current
    const afterTransition = isTransitionPending()
    if (!element || !INTRO_ENABLED || !(playsIntro() || afterTransition)) return
    // Measured from the top of the page (a new page is shown from its top)
    const top = element.getBoundingClientRect().top + window.scrollY
    if (top >= window.innerHeight) return

    element.style.setProperty('--slide-from', `${Math.ceil(window.innerHeight - top)}px`)
    const play = (delay) => {
      element.classList.remove('intro-slide-up-wait')
      element.style.setProperty('--slide-delay', `${delay}ms`)
      element.classList.add('intro-slide-up')
    }
    const onEnd = (event) => {
      if (event.target !== element || event.animationName !== 'intro-slide-up') return
      element.classList.remove('intro-slide-up')
      element.removeEventListener('animationend', onEnd)
    }
    element.addEventListener('animationend', onEnd)

    let stopWaiting
    if (afterTransition) {
      element.classList.add('intro-slide-up-wait') // held below until the reveal
      stopWaiting = onReveal(() => play(REVEAL_LEAD))
    } else {
      play(SWEEP_DURATION)
    }
    return () => {
      stopWaiting?.()
      element.removeEventListener('animationend', onEnd)
    }
  }, [ref])
}
