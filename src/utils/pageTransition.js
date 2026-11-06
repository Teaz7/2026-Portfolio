/*
  Page transition state, shared with the pages: while the purple panel covers the
  screen, the new page renders underneath but waits. When the panel starts sliding
  away ("reveal"), page entrances start (usePageEntrance) and scroll reveals start
  checking their position again (useScrollReveal).
*/
let pending = false
const revealListeners = new Set()

// How long after the panel starts sliding away the page content begins (ms)
export const REVEAL_LEAD = 350

export const isTransitionPending = () => pending

export const beginTransition = () => {
  pending = true
}

export const onReveal = (listener) => {
  revealListeners.add(listener)
  return () => revealListeners.delete(listener)
}

export function announceReveal() {
  pending = false
  revealListeners.forEach((listener) => listener())
  // Let scroll reveals check their position once the page entrances are set up
  setTimeout(() => window.dispatchEvent(new Event('scroll')), 50)
}
