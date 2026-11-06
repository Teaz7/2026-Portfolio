/*
  Page-load intro: the purple sweep plays on every full load or refresh, then the
  navbar and (when Home is the first page) the hero animate in.
  Navigating to Home later shows it straight away, without replaying the sequence.
*/
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const INTRO_ENABLED = !reduceMotion

// When page content starts appearing (ms), as the purple panel slides away
export const INTRO_DELAY = 1200

let onFirstPage = true

/*
  Scroll reveals that trigger while something else is still animating in (the
  sweep on load, a page header) wait until it's done. Starts as the sweep.
*/
let holdUntil = INTRO_ENABLED ? performance.now() + INTRO_DELAY : 0

export const holdRevealsFor = (ms) => {
  holdUntil = Math.max(holdUntil, performance.now() + ms)
}
export const revealWait = () => Math.max(0, Math.round(holdUntil - performance.now()))

export const playsIntro = () => INTRO_ENABLED && onFirstPage
export const leaveFirstPage = () => {
  onFirstPage = false
}

// Inline animation delay, measured from the moment the sweep reveals the page
export const introDelay = (ms) => ({ animationDelay: `${INTRO_DELAY + ms}ms` })

// Stagger whose steps shrink a little each item, so a row reads as a wave, not a metronome
export const stagger = (index, step) => Math.round(index * step * (1 - index * 0.04))
