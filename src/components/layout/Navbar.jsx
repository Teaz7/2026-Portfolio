import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { Menu, X } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { navLinks } from '../../data/site.js'
import { INTRO_ENABLED, introDelay, stagger } from '../../utils/intro.js'
import logo from '../../assets/logo/logo-black.svg'
import './Navbar.css'

// Page-load entrance: brand first, then each link left to right
const linkDelay = (index) => introDelay(100 + stagger(index, 60))

/*
  Desktop: brand on the left, links on the right.
  Tablet/phone (below 1200px): a round menu button stays in the top-right corner
  while scrolling; it opens the links as a full-screen purple menu (Navbar.css).
*/
function Navbar() {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  // While the menu is open the page behind it doesn't scroll; Esc closes it
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      lenis?.start()
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, lenis])

  // Picking a link closes the menu (the page transition / scroll takes over)
  const closeOnLink = (event) => {
    if (event.target.closest('a')) setOpen(false)
  }

  return (
    <header
      className={`navbar${INTRO_ENABLED ? ' navbar--intro' : ''}${open ? ' navbar--open' : ''}`}
    >
      <Container className="navbar__inner">
        <Link to="/" className="navbar__brand" style={introDelay(0)}>
          <img src={logo} alt="" className="navbar__logo" />
          <span className="navbar__titles">
            <span className="navbar__title">2026 Website Portfolio</span>
            <span className="navbar__subtitle">Developed with React.js</span>
          </span>
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="main-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav aria-label="Main">
          <ul id="main-menu" className="navbar__links" onClick={closeOnLink}>
            {navLinks.map(({ to, label }, index) => (
              <li key={to} style={{ ...linkDelay(index), '--i': index }}>
                <NavLink to={to} end={to === '/'} className="navbar__link">
                  {label}
                </NavLink>
              </li>
            ))}
            <li style={{ ...linkDelay(navLinks.length), '--i': navLinks.length }}>
              <Button href="#contact" size="sm">
                Contact
              </Button>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Navbar
