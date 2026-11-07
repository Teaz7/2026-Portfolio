import { useSyncExternalStore } from 'react'

/*
  Current layout size, matching the CSS breakpoints (see index.css):
  'desktop' (1200px and up), 'tablet' (640–1199px) or 'phone' (639px and below).
  Re-renders when the window crosses a breakpoint.
*/
const tabletQuery = window.matchMedia('(max-width: 1199px)')
const phoneQuery = window.matchMedia('(max-width: 639px)')

const getSize = () => (phoneQuery.matches ? 'phone' : tabletQuery.matches ? 'tablet' : 'desktop')

function subscribe(onChange) {
  tabletQuery.addEventListener('change', onChange)
  phoneQuery.addEventListener('change', onChange)
  return () => {
    tabletQuery.removeEventListener('change', onChange)
    phoneQuery.removeEventListener('change', onChange)
  }
}

export function useScreenSize() {
  return useSyncExternalStore(subscribe, getSize)
}
