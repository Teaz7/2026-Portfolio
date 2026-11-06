import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import './Carousel.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
  Dark band with screenshots, one group of images per slide.
  slides: [[{ src, name }, ...], ...]  (use chunk() from utils/images.js)
  height: slide height, e.g. '37.5rem' for phone screens
  accent: project color for the arrows' hover/click, e.g. 'var(--color-aibrecare)'
          (purple when not set)

  Loops in one direction: a copy of the last slide sits before the first and a copy
  of the first after the last. After sliding onto a copy, the track jumps
  (without animation) to the real slide.
*/
function Carousel({ slides, label, height = '37.5rem', accent }) {
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
      className="carousel"
      aria-roledescription="carousel"
      aria-label={label}
      style={{ '--carousel-height': height, '--carousel-accent': accent }}
    >
      {loops && (
        <button className="carousel__arrow" onClick={() => go(-1)} aria-label="Previous slide">
          <ArrowLeft aria-hidden="true" />
        </button>
      )}

      <div className="carousel__viewport">
        <div
          className={`carousel__track${instant ? ' carousel__track--instant' : ''}`}
          style={{ transform: `translateX(-${position * 100}%)` }}
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
                    decoding="async"
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {loops && (
        <button className="carousel__arrow" onClick={() => go(1)} aria-label="Next slide">
          <ArrowRight aria-hidden="true" />
        </button>
      )}
    </section>
  )
}

export default Carousel
