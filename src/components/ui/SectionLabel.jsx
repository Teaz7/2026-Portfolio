import Typewriter from './Typewriter.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import './SectionLabel.css'

// Diamond: slides in as a square, then turns; the text types once it's turning
const LABEL_TYPING = { delay: 450, speed: 35 }

/*
  "◆ LABEL" heading. tone: 'dark' on white backgrounds, 'light' on dark/purple ones.
  Animates when scrolled into view (and replays after scrolling back up past it).
  Pass `reveal` ({ phase, run }) to drive it from a parent's reveal instead.
*/
function SectionLabel({ as: Tag = 'h2', tone = 'dark', reveal, children }) {
  const own = useScrollReveal({ playAt: 0.85, resetAt: 1, enabled: !reveal })
  const { phase, run, wait = 0 } = reveal ?? own
  const text = typeof children === 'string' ? children : null

  return (
    <Tag
      ref={reveal ? undefined : own.ref}
      className={`section-label section-label--${tone} section-label--${phase}`}
    >
      <span
        className="section-label__diamond"
        aria-hidden="true"
        style={wait ? { animationDelay: `${wait}ms` } : undefined}
      />
      {text ? (
        <span>
          <Typewriter
            key={run}
            text={text}
            play={phase !== 'done'}
            active={phase === 'play'}
            speed={LABEL_TYPING.speed}
            delay={wait + LABEL_TYPING.delay}
          />
        </span>
      ) : (
        children
      )}
    </Tag>
  )
}

export default SectionLabel
