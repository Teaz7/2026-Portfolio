/*
  Page-load intro: the purple sweep plays on every full load or refresh, then the
  navbar and (when Home is the first page) the hero animate in.
  Navigating to Home later shows it straight away, without replaying the sequence.
*/
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const INTRO_ENABLED = !reduceMotion

// When page content starts appearing (ms), as the purple panel slides away
export const INTRO_DELAY = 1200

// When the purple sweep has fully left the screen (ms), see IntroOverlay.css
export const SWEEP_DURATION = 1500

let onFirstPage = true

/*
  Scroll reveals that trigger while something else is still animating in (the
  sweep on load, a page header, a section above) wait until it's done. A hold tied
  to an element only counts while that element still reaches below the top quarter
  of the screen, so scrolling past a section doesn't leave the next one waiting.
  Starts as the sweep.
*/
let holds = INTRO_ENABLED ? [{ until: performance.now() + INTRO_DELAY, element: null }] : []

export const holdRevealsFor = (ms, element = null) => {
  holds.push({ until: performance.now() + ms, element })
}

const onScreen = (element) => {
  const { top, bottom } = element.getBoundingClientRect()
  return bottom > window.innerHeight * 0.25 && top < window.innerHeight
}

// A section above holds back the next one by at most this much (page holds are uncapped)
const MAX_SECTION_WAIT = 800

export const revealWait = () => {
  const now = performance.now()
  holds = holds.filter(({ until }) => until > now)
  const waits = holds.map(({ until, element }) => {
    if (!element) return until - now
    return onScreen(element) ? Math.min(until - now, MAX_SECTION_WAIT) : 0
  })
  return Math.round(Math.max(0, ...waits))
}

export const playsIntro = () => INTRO_ENABLED && onFirstPage
export const leaveFirstPage = () => {
  onFirstPage = false
}

// Inline animation delay, measured from the moment the sweep reveals the page
export const introDelay = (ms) => ({ animationDelay: `${INTRO_DELAY + ms}ms` })

// Stagger whose steps shrink a little each item, so a row reads as a wave, not a metronome
export const stagger = (index, step) => Math.round(index * step * (1 - index * 0.04))
