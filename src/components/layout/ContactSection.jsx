import { useEffect, useRef, useState } from 'react'
import { Check, Download, Mail } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import SectionLabel from '../ui/SectionLabel.jsx'
import MaskIcon from '../ui/MaskIcon.jsx'
import Typewriter from '../ui/Typewriter.jsx'
import { revealDelay, useScrollReveal } from '../../hooks/useScrollReveal.js'
import { site } from '../../data/site.js'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import githubIcon from '../../assets/icons/github.svg'
import './ContactSection.css'

const COPIED_DURATION = 2000

/*
  Reveal timeline, in ms after the section scrolls into view: the diamond comes in
  as a square and turns, "Contact" and "Let's Connect!" type, the links wipe in,
  the pitch fades in, the buttons slide in from the right, then the availability.
*/
const HEADING = 'Let’s Connect!'
const headingTyping = { delay: 800, speed: 45 } // after the label (SectionLabel.jsx)
const LINKS_START = headingTyping.delay + HEADING.length * headingTyping.speed + 50
const PITCH_START = LINKS_START + 200
const BUTTONS_START = PITCH_START + 250
const BUTTON_STEP = 110
const AVAILABILITY_START = BUTTONS_START + BUTTON_STEP + 400

// Envelope and check stacked in one spot so they can cross-fade
function CopyIcon({ className }) {
  return (
    <span className={`${className} contact__copy-icon`} aria-hidden="true">
      <Mail className="copy-default" />
      <Check className="copy-done" />
    </span>
  )
}

// Clipboard API, with a fallback for browsers/contexts that block it
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const field = document.createElement('textarea')
    field.value = text
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.append(field)
    field.select()
    document.execCommand('copy')
    field.remove()
  }
}

// Purple "Let's Connect!" section + footer, shown at the bottom of every page
function ContactSection() {
  const { linkedin, github } = site.links
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef(null)
  // Plays when the section's top is 60% down the screen; resets once it's scrolled
  // back off the bottom, so it replays next time
  const { ref, phase, run } = useScrollReveal({ playAt: 0.6, resetAt: 1 })
  const typing = { play: phase !== 'done', active: phase === 'play' }

  useEffect(() => () => clearTimeout(copiedTimer.current), [])

  // The email button copies the address and shows "Copied!" for 2 seconds
  const copyEmail = async () => {
    await copyText(site.email)
    setCopied(true)
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(false), COPIED_DURATION)
  }

  return (
    <footer ref={ref} id="contact" className={`contact contact--${phase}`}>
      <Container className="contact__inner">
        <div className="contact__main">
          <SectionLabel tone="light" reveal={{ phase, run }}>
            Contact
          </SectionLabel>
          <p className="contact__heading">
            <Typewriter key={run} text={HEADING} {...typing} {...headingTyping} />
          </p>
          <ul className="contact__links" style={revealDelay(LINKS_START)}>
            <li>
              <a href={linkedin.href} target="_blank" rel="noreferrer">
                <MaskIcon src={linkedinIcon} size="1.375rem" />
                {linkedin.label}
              </a>
            </li>
            <li>
              <a href={github.href} target="_blank" rel="noreferrer">
                <MaskIcon src={githubIcon} size="1.5rem" />
                {github.label}
              </a>
            </li>
          </ul>
        </div>

        <div className="contact__aside">
          <p className="contact__pitch" style={revealDelay(PITCH_START)}>
            I’m currently looking for an OJT opportunity in software development. Feel free to
            reach out.
          </p>
          <div className="contact__actions">
            <Button
              variant="light"
              size="md"
              shape="soft"
              icon={CopyIcon}
              className={`contact__button${copied ? ' is-copied' : ''}`}
              style={revealDelay(BUTTONS_START)}
              onClick={copyEmail}
              aria-label={`Copy email address ${site.email}`}
            >
              {/* Both labels share one grid cell so the button keeps its width */}
              <span className="contact__copy-label">
                <span className="copy-default">{site.email}</span>
                <span className="copy-done">Copied!</span>
              </span>
            </Button>
            <span className="visually-hidden" role="status">
              {copied ? 'Email address copied' : ''}
            </span>
            <Button
              href={site.resume.href}
              download={site.resume.fileName}
              variant="dark"
              size="md"
              shape="soft"
              icon={Download}
              className="contact__button"
              style={revealDelay(BUTTONS_START + BUTTON_STEP)}
            >
              Download Resume
            </Button>
          </div>
          <p className="contact__availability" style={revealDelay(AVAILABILITY_START)}>{site.availability}</p>
        </div>
      </Container>

      <Container>
        <p className="contact__copyright">© 2026 {site.name} • Built with React.js</p>
      </Container>
    </footer>
  )
}

export default ContactSection
