import { useState } from 'react'
import './Carousel.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
  slides:     [[{ src, name }, ...], ...]  (use chunk() from utils/images.js)
  width:      visible window width, e.g. '78.625rem'
  height:     visible window height, e.g. '37.5rem'
  slideWidth: narrower than `width` to show the neighboring slides at the edges (peek)
  fit:        'height' = images are `height` tall (phone screens)
              'width'  = images share the slide width and align to the top (page mockups)
  accent:     project color for the arrows' hover/click, e.g. 'var(--color-aibrecare)'
              (purple when not set)

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

  const go = (step) => {
    if (animating) return
    if (prefersReducedMotion()) {
      setInstant(true)
      setPosition((current) => ((current - 1 + step + count) % count) + 1)
      return
    }
    setInstant(false)
    setAnimating(true)
    setPosition((current) => current + step)
  }

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return
    setAnimating(false)
    if (position === 0 || position === count + 1) {
      setInstant(true)
      setPosition(position === 0 ? count : 1)
    }
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
      {loops && (
        <button className="carousel__arrow" onClick={() => go(-1)} aria-label="Previous slide">
          <ArrowIcon />
        </button>
      )}

      <div className="carousel__viewport">
        <div
          className={`carousel__track${instant ? ' carousel__track--instant' : ''}`}
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
                    alt={isCopy ? '' : `${label} screen ${image.name}`}
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
    </section>
  )
}

export default Carousel
