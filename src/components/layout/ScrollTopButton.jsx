import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { easeOutQuart, reduceMotion } from './scrolling.js'
import { priorityScrollTo } from '../../utils/scrollPriority.js'
import './ScrollTopButton.css'

const SHOW_AFTER = 0.8 // screen heights scrolled

// Round "back to top" button, bottom right on every page once you've scrolled down
function ScrollTopButton() {
  const lenis = useLenis()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * SHOW_AFTER)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollToTop = () => {
    // Takes priority over any animation that's playing (see scrollPriority.js)
    if (lenis) priorityScrollTo(lenis, 0, { duration: 1, easing: easeOutQuart, immediate: reduceMotion })
    else window.scrollTo({ top: 0 })
  }

  return (
    <button
      type="button"
      className={`scroll-top${visible ? ' scroll-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="scroll-top__icon" aria-hidden="true" />
    </button>
  )
}

export default ScrollTopButton
