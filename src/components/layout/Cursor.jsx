import { useEffect, useRef } from 'react'
import './Cursor.css'

/*
  Custom cursor: a purple dot plus a ring that trails behind it.
  - The ring grows over links and buttons
  - Turns white inside sections marked data-cursor="light" (purple sections)
  - Switches to a blend mode (inverted colors) when it's the same color as the
    background under it, e.g. over a purple button
  - Not used on touch screens; the normal text cursor shows in text fields
*/

const INTERACTIVE = 'a, button, [role="button"], summary, label'
const TEXT_FIELD = 'input, textarea, select, [contenteditable="true"]'
const PURPLE = [148, 88, 188]
const WHITE = [255, 255, 255]
const RING_FOLLOW = 1 // 1 = no trail, lower = longer trail
const SAME_COLOR_DISTANCE = 90

const parseColor = (value) => {
  const [r, g, b, a = 1] = (value.match(/[\d.]+/g) ?? []).map(Number)
  return r === undefined || a < 0.5 ? null : [r, g, b]
}

// First solid background color behind an element
const backgroundOf = (element) => {
  for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
    const color = parseColor(getComputedStyle(node).backgroundColor)
    if (color) return color
  }
  return WHITE
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

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

    const updateState = () => {
      if (!target) return
      const light = Boolean(target.closest('[data-cursor="light"]'))
      const blend = distance(backgroundOf(target), light ? WHITE : PURPLE) < SAME_COLOR_DISTANCE
      cursor.classList.toggle('cursor--light', light || blend)
      cursor.classList.toggle('cursor--blend', blend)
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
    const onScroll = () => setTarget(document.elementFromPoint(mouse.x, mouse.y))

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
      <span ref={ringRef} className="cursor__ring" />
      <span ref={dotRef} className="cursor__dot" />
    </div>
  )
}

export default Cursor
