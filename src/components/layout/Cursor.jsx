import { useEffect, useRef } from 'react'
import { isPriorityScroll } from '../../utils/scrollPriority.js'
import './Cursor.css'

/*
  Custom cursor: a dot plus a ring that trails behind it.
  - On light backgrounds it's purple; text under it (purple or dark) shows as white.
    This uses an SVG backdrop filter, which only Chromium browsers support, so
    other browsers get a plain purple cursor there.
  - On anything else (purple buttons, dark bands, the Contact section, photos) it
    turns whatever is underneath into strict black/white and inverts it, so text
    under the dot flips color (same technique as onform.studio)
  - The ring grows over links and buttons
  - Not used on touch screens; the normal text cursor shows in text fields
*/

const INTERACTIVE = 'a, button, [role="button"], summary, label'
const TEXT_FIELD = 'input, textarea, select, [contenteditable="true"]'
const RING_FOLLOW = 0.4 // 1 = no trail, lower = longer trail
const LIGHT_CHANNEL = 230 // every RGB channel at least this = light surface

const supportsSvgBackdrop = () =>
  Boolean(navigator.userAgentData?.brands?.some(({ brand }) => brand === 'Chromium'))

const parseColor = (value) => {
  const [r, g, b, a = 1] = (value.match(/[\d.]+/g) ?? []).map(Number)
  return r === undefined || a < 0.7 ? null : [r, g, b]
}

// First solid background color behind an element
const backgroundOf = (element) => {
  for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
    const color = parseColor(getComputedStyle(node).backgroundColor)
    if (color) return color
  }
  return [255, 255, 255]
}

function Cursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cursor = cursorRef.current
    const root = document.documentElement
    const mouse = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let target = null
    let frame
    let recheckTimer

    root.classList.add('has-custom-cursor')
    cursor.classList.toggle('cursor--svg', supportsSvgBackdrop())

    const updateState = () => {
      if (!target) return
      const lightSurface = backgroundOf(target).every((channel) => channel >= LIGHT_CHANNEL)
      cursor.classList.toggle('cursor--contrast', !lightSurface)
      cursor.classList.toggle('cursor--hover', Boolean(target.closest(INTERACTIVE)))
      cursor.classList.toggle('cursor--hidden', Boolean(target.closest(TEXT_FIELD)))
    }

    const setTarget = (element) => {
      if (!element || element === target) return
      target = element
      updateState()
      // Check again once hover colors have finished changing
      clearTimeout(recheckTimer)
      recheckTimer = setTimeout(updateState, 320)
    }

    const onMouseMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
      cursor.classList.remove('cursor--away')
      setTarget(event.target)
    }

    // Content moves under a still mouse while scrolling
    const onScroll = () => {
      if (!isPriorityScroll()) setTarget(document.elementFromPoint(mouse.x, mouse.y))
    }

    const onMouseOut = (event) => {
      if (!event.relatedTarget) cursor.classList.add('cursor--away')
    }

    const tick = () => {
      const follow = reduceMotion ? 1 : RING_FOLLOW
      ring.x += (mouse.x - ring.x) * follow
      ring.y += (mouse.y - ring.y) * follow
      dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`
      ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseout', onMouseOut)
    window.addEventListener('scroll', onScroll, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      root.classList.remove('has-custom-cursor')
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseout', onMouseOut)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      clearTimeout(recheckTimer)
    }
  }, [])

  return (
    <div ref={cursorRef} className="cursor cursor--away" aria-hidden="true">
      {/* Light surfaces: light pixels -> purple, everything else (text) -> white */}
      <svg className="cursor__filters" width="0" height="0">
        <filter id="cursor-light" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 0 1"
          />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="1 1 1 1 0.5804" />
            <feFuncG type="discrete" tableValues="1 1 1 1 0.3451" />
            <feFuncB type="discrete" tableValues="1 1 1 1 0.7373" />
          </feComponentTransfer>
        </filter>
      </svg>
      <span ref={ringRef} className="cursor__ring" />
      <span ref={dotRef} className="cursor__dot" />
    </div>
  )
}

export default Cursor
