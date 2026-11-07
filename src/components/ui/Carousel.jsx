import { useRef, useState } from 'react'
import './Carousel.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Swipe: how far the finger has to move before the carousel takes over the gesture,
// and how far (or how fast) a release has to be to change slides
const DRAG_START = 6 // px
const SWIPE_DISTANCE = 0.18 // share of the window width
const SWIPE_SPEED = 0.4 // px per ms (a quick flick)

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
*/
function Carousel({ slides, label, width, height, slideWidth = width, fit = 'height', accent }) {
  const count = slides.length
  const loops = count > 1
  const track = loops ? [slides[count - 1], ...slides, slides[0]] : slides

  const [position, setPosition] = useState(loops ? 1 : 0)
  const [animating, setAnimating] = useState(false)
  const [instant, setInstant] = useState(false)
  const [dragOffset, setDragOffset] = useState(null) // px while a finger/mouse drags
  const drag = useRef(null)

  // Real slide on screen (0-based), also while sitting on a copy
  const current = loops ? (position - 1 + count) % count : 0

  const go = (step) => {
    if (animating || step === 0) return
    if (prefersReducedMotion()) {
      setInstant(true)
      setPosition((value) => ((((value - 1 + step) % count) + count) % count) + 1)
      return
    }
    setInstant(false)
    setAnimating(true)
    setPosition((value) => value + step)
  }

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return
    setAnimating(false)
    if (position === 0 || position === count + 1) {
      setInstant(true)
      setPosition(position === 0 ? count : 1)
    }
  }

  // Swipe / drag. touch-action: pan-y (Carousel.css) leaves vertical swipes to page
  // scrolling; the browser cancels the pointer when it takes a gesture over.
  const onPointerDown = (event) => {
    if (!loops || animating || (event.pointerType === 'mouse' && event.button !== 0)) return
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      time: event.timeStamp,
      width: event.currentTarget.offsetWidth,
      moved: false,
    }
  }

  const onPointerMove = (event) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    const dx = event.clientX - state.x
    if (!state.moved) {
      if (Math.abs(dx) < DRAG_START) return
      state.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setInstant(false)
    }
    setDragOffset(Math.max(-state.width, Math.min(state.width, dx)))
  }

  const endDrag = (event, released) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    drag.current = null
    if (!state.moved) return
    const dx = event.clientX - state.x
    const speed = Math.abs(dx) / Math.max(1, event.timeStamp - state.time)
    const far = Math.abs(dx) > state.width * SWIPE_DISTANCE
    const flick = speed > SWIPE_SPEED && Math.abs(dx) > 20
    setDragOffset(null) // eases on to the next slide, or back if the swipe was too short
    if (released && (far || flick)) go(dx < 0 ? 1 : -1)
  }

  const dragging = dragOffset !== null

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
        '--carousel-drag': `${dragOffset ?? 0}px`,
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
            className={`carousel__track${instant || dragging ? ' carousel__track--instant' : ''}`}
            onTransitionEnd={handleTransitionEnd}
          >
            {track.map((images, trackIndex) => {
              const isCopy = loops && (trackIndex === 0 || trackIndex === count + 1)
              const slideNumber = loops ? ((trackIndex - 1 + count) % count) + 1 : trackIndex + 1
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
              onClick={() => go(index + 1 - position)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Carousel
