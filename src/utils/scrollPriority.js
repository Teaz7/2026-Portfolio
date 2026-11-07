/*
  Priority scrolls (back to top, jumps to a #section): while one runs, everything
  else steps aside so the scroll stays smooth even mid-animation:
  - scroll reveals stop checking their position (passing every section on the way
    up would otherwise reset each one mid-scroll)
  - typing stops updating, and the custom cursor stops re-checking its color
  When it ends, a scroll event lets everything catch up at the new position (the
  resets run at low priority, see useScrollReveal).
*/
let active = false
let safetyTimer

export const isPriorityScroll = () => active

function finish() {
  if (!active) return
  active = false
  clearTimeout(safetyTimer)
  window.dispatchEvent(new Event('scroll'))
}

export function priorityScrollTo(lenis, target, { duration, easing, immediate = false }) {
  active = true
  lenis.scrollTo(target, {
    duration,
    easing,
    immediate,
    force: true,
    lock: true, // the wheel can't interrupt it
    onComplete: finish,
  })
  // In case the scroll ends without completing (e.g. interrupted)
  safetyTimer = setTimeout(finish, duration * 1000 + 400)
  if (immediate) finish()
}
