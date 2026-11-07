import { useLayoutEffect, useRef, useState } from 'react'
import './Carousel.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Swipe: how far the finger has to move before the carousel takes over the gesture,
// and how far (or how fast) a release has to be to change slides
const DRAG_START = 6 // px
const SWIPE_DISTANCE = 0.18 // share of the window width
// A flick is judged by how fast the finger is moving as it lets go (over the last
// VELOCITY_WINDOW ms), not the average since it touched down: a drag that starts
// slow and ends with a flick still counts, and one that stops before release doesn't
const FLICK_SPEED = 0.11 // px per ms
const VELOCITY_WINDOW = 100 // ms

// Arrow from the Figma carousel buttons (points left; flipped for "next")
function ArrowIcon() {
  return (
    <svg viewBox="27.1667 27.1667 40.6666 40.6666" aria-hidden="true">
      <path
        d="M36.8885 44.9583L67.8333 44.9583L67.8333 50.0417L36.8885 50.0417L51.1219 64.275L47.5 67.8333L27.1667 47.5L47.5 27.1667L51.1219 30.725L36.8885 44.9583Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Image fade-in (Carousel.css): mark each image once it has loaded. Images already
// in the cache can finish before React attaches onLoad, so the ref checks too.
const markLoaded = (event) => {
  event.currentTarget.dataset.loaded = ''
}
const markIfLoaded = (img) => {
  if (img?.complete && img.naturalWidth) img.dataset.loaded = ''
}

/*
  Dark band with screenshots, one group of images per slide.
  slides:     [[{ src, name, alt?, pixelated? }, ...], ...]  (chunk() in utils/images.js)
  width:      visible window width, e.g. '78.625rem'
  height:     visible window height, e.g. '37.5rem'
  slideWidth: narrower than `width` to show the neighboring slides at the edges (peek)
  fit:        'height' = images are `height` tall (phone screens)
              'width'  = images share the slide width and align to the top (page mockups)
              'contain' = each image fits whole inside the slide box (mixed photo shapes)
  accent:     project color for the arrows' hover/click and the current dot,
              e.g. 'var(--color-aibrecare)' (purple when not set)

  Navigation: swipe/drag the images, tap a dot, or the arrows (desktop only).
  Loops in one direction: a copy of the last slide sits before the first and a copy
  of the first after the last. After sliding onto a copy, the track jumps
  (without animation) to the real slide.

  Interruptible: a swipe, arrow click or dot tap while a slide is still moving
  retargets it from where it is (the CSS transition picks up mid-way), so quick
  flicks in a row each count. Two copies sit on each side so a quick run of flicks
  past either end still has somewhere to go before the jump back.
*/
function Carousel({ slides, label, width, height, slideWidth = width, fit = 'height', accent }) {
  const count = slides.length
  const loops = count > 1
  const copies = loops ? Math.min(2, count) : 0
  const track = loops ? [...slides.slice(-copies), ...slides, ...slides.slice(0, copies)] : slides
  const lastIndex = track.length - 1

  const [position, setPositionState] = useState(copies)
  const positionRef = useRef(copies) // latest target, also between renders
  const setPosition = (value) => {
    positionRef.current = value
    setPositionState(value)
  }
  const [instant, setInstant] = useState(false)
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)
  const trackRef = useRef(null)

  /*
    While dragging, the finger moves the track directly (an inline transform set in
    onPointerMove): no React render or style recalculation of the slides per move.
    React only renders when the drag starts and ends. The inline transform is
    removed in the same frame the release (next slide, or back) is rendered, so the
    track eases on from exactly where the finger let go.
  */
  useLayoutEffect(() => {
    const element = trackRef.current
    if (dragging || !element) return
    element.style.transform = ''
    element.style.transition = ''
  }, [dragging, position])

  // Real slide (0-based) for any track position, copies included
  const realIndex = (value) => (((value - copies) % count) + count) % count
  const current = loops ? realIndex(position) : 0

  const go = (step) => {
    if (step === 0 || drag.current?.moved) return
    if (prefersReducedMotion()) {
      setInstant(true)
      setPosition(copies + realIndex(positionRef.current + step))
      return
    }
    const target = positionRef.current + step
    if (target < 0 || target > lastIndex) return // past the copies: only on a very long burst
    setInstant(false)
    setPosition(target)
  }

  // Dot tap: the closest track position showing that slide (a copy, if the track is
  // near one), so it never spins the long way round
  const goTo = (index) => {
    const from = positionRef.current
    const options = [-count, 0, count]
      .map((shift) => copies + index + shift)
      .filter((value) => value >= 0 && value <= lastIndex)
    const target = options.reduce((best, value) =>
      Math.abs(value - from) < Math.abs(best - from) ? value : best,
    )
    go(target - from)
  }

  // Once the slide settles on a copy, jump (without animation) to the real slide
  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
    const value = positionRef.current
    if (value < copies || value >= copies + count) {
      setInstant(true)
      setPosition(copies + realIndex(value))
    }
  }

  // Where `position` puts the track, and where it's drawn right now (px). They differ
  // while a slide is still moving; a drag starts from where it's drawn, no jump.
  const measureTrack = () => {
    const element = trackRef.current
    const [first, second] = element.children
    const pitch = second.offsetLeft - first.offsetLeft // slide width + gap
    const viewport = element.parentElement.clientWidth
    const targetX = (viewport - first.offsetWidth) / 2 - positionRef.current * pitch
    const currentX = new DOMMatrixReadOnly(getComputedStyle(element).transform).m41
    return { targetX, currentX }
  }

  // Swipe / drag. touch-action: pan-y (Carousel.css) leaves vertical swipes to page
  // scrolling; the browser cancels the pointer when it takes a gesture over.
  const onPointerDown = (event) => {
    if (!loops || (event.pointerType === 'mouse' && event.button !== 0)) return
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      samples: [{ x: event.clientX, t: event.timeStamp }], // recent finger positions
      width: event.currentTarget.offsetWidth,
      moved: false,
      targetX: 0,
      from: 0,
    }
  }

  const onPointerMove = (event) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    const dx = event.clientX - state.x
    if (!state.moved) {
      if (Math.abs(dx) < DRAG_START) return
      state.moved = true
      const { targetX, currentX } = measureTrack()
      state.targetX = targetX
      state.from = currentX - targetX // catch the slide mid-way if it's still moving
      trackRef.current.style.transition = 'none' // follow the finger from the first move
      event.currentTarget.setPointerCapture(event.pointerId)
      setInstant(false)
      setDragging(true)
    }
    state.samples.push({ x: event.clientX, t: event.timeStamp })
    if (state.samples.length > 20) state.samples.shift()
    const offset = Math.max(-state.width, Math.min(state.width, state.from + dx))
    trackRef.current.style.transform = `translateX(${state.targetX + offset}px)`
  }

  const endDrag = (event, released) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    drag.current = null
    if (!state.moved) return
    const dx = event.clientX - state.x

    // Release velocity: from the oldest sample within the last VELOCITY_WINDOW ms
    const now = event.timeStamp
    const since = state.samples.find((sample) => now - sample.t <= VELOCITY_WINDOW)
    const velocity = since && now > since.t ? (event.clientX - since.x) / (now - since.t) : 0
    const flick = Math.abs(velocity) > FLICK_SPEED
    const far = Math.abs(dx) > state.width * SWIPE_DISTANCE

    // A flick goes the way it was dragged; pulling back as you let go (moving
    // against the drag) cancels it, so the slide settles back. Without a flick, a
    // long enough drag goes the way it was dragged.
    const flickDirection = Math.sign(velocity) === Math.sign(dx) ? Math.sign(dx) : 0
    const direction = flick ? flickDirection : far ? Math.sign(dx) : 0
    setDragging(false) // eases on to the next slide, or back if the swipe was too short
    if (released && direction !== 0) go(direction < 0 ? 1 : -1)
  }

  return (
    <section
      className={`carousel carousel--fit-${fit}`}
      aria-roledescription="carousel"
      aria-label={label}
      style={{
        '--carousel-width': width,
        '--carousel-height': height,
        '--carousel-slide': slideWidth,
        '--carousel-position': position,
        '--carousel-accent': accent,
      }}
    >
      <div className="carousel__row">
        {loops && (
          <button className="carousel__arrow" onClick={() => go(-1)} aria-label="Previous slide">
            <ArrowIcon />
          </button>
        )}

        <div
          className={`carousel__viewport${loops ? ' carousel__viewport--swipe' : ''}${dragging ? ' is-dragging' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => endDrag(event, true)}
          onPointerCancel={(event) => endDrag(event, false)}
        >
          <div
            ref={trackRef}
            className={`carousel__track${instant || dragging ? ' carousel__track--instant' : ''}`}
            onTransitionEnd={handleTransitionEnd}
          >
            {track.map((images, trackIndex) => {
              const isCopy = loops && (trackIndex < copies || trackIndex >= copies + count)
              const slideNumber = loops ? realIndex(trackIndex) + 1 : trackIndex + 1
              return (
                <div
                  key={trackIndex}
                  className="carousel__slide"
                  role={isCopy ? undefined : 'group'}
                  aria-roledescription={isCopy ? undefined : 'slide'}
                  aria-label={isCopy ? undefined : `${slideNumber} of ${count}`}
                  aria-hidden={trackIndex !== position}
                >
                  {images.map((image) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={isCopy ? '' : (image.alt ?? `${label} screen ${image.name}`)}
                      className={image.pixelated ? 'is-pixelated' : undefined}
                      draggable={false}
                      ref={markIfLoaded}
                      onLoad={markLoaded}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {loops && (
          <button
            className="carousel__arrow carousel__arrow--next"
            onClick={() => go(1)}
            aria-label="Next slide"
          >
            <ArrowIcon />
          </button>
        )}
      </div>

      {/* Which slide is showing; each dot jumps to its slide */}
      {loops && (
        <div className="carousel__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`carousel__dot${index === current ? ' is-current' : ''}`}
              aria-label={`Slide ${index + 1} of ${count}`}
              aria-current={index === current ? 'true' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Carousel
