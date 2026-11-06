import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import './Lightbox.css'

// Full-screen image viewer opened from ImageGrid. Esc closes, arrow keys navigate.
function Lightbox({ items, index, onClose, onChange }) {
  const closeRef = useRef(null)
  const lenis = useLenis()
  const item = items[index]
  const count = items.length

  // Pause page scrolling while open, and return focus to the thumbnail on close
  useEffect(() => {
    const previousFocus = document.activeElement
    lenis?.stop()
    closeRef.current?.focus()

    return () => {
      lenis?.start()
      previousFocus?.focus()
    }
  }, [lenis])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((index - 1 + count) % count)
      if (event.key === 'ArrowRight') onChange((index + 1) % count)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, count, onClose, onChange])

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.alt} onClick={onClose}>
      <button ref={closeRef} className="lightbox__button lightbox__close" onClick={onClose} aria-label="Close">
        <X aria-hidden="true" />
      </button>

      {count > 1 && (
        <button
          className="lightbox__button lightbox__prev"
          onClick={(event) => {
            event.stopPropagation()
            onChange((index - 1 + count) % count)
          }}
          aria-label="Previous image"
        >
          <ArrowLeft aria-hidden="true" />
        </button>
      )}

      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img src={item.src} alt={item.alt} className={item.pixelated ? 'is-pixelated' : undefined} />
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>

      {count > 1 && (
        <button
          className="lightbox__button lightbox__next"
          onClick={(event) => {
            event.stopPropagation()
            onChange((index + 1) % count)
          }}
          aria-label="Next image"
        >
          <ArrowRight aria-hidden="true" />
        </button>
      )}
    </div>,
    document.body,
  )
}

export default Lightbox
