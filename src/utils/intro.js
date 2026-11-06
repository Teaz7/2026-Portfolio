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

export const playsIntro = () => INTRO_ENABLED && onFirstPage
export const leaveFirstPage = () => {
  onFirstPage = false
}

// Inline animation delay, measured from the moment the sweep reveals the page
export const introDelay = (ms) => ({ animationDelay: `${INTRO_DELAY + ms}ms` })

// Stagger whose steps shrink a little each item, so a row reads as a wave, not a metronome
export const stagger = (index, step) => Math.round(index * step * (1 - index * 0.04))
