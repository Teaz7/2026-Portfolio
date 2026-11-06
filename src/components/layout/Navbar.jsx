import { Link, NavLink } from 'react-router-dom'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { navLinks } from '../../data/site.js'
import { INTRO_ENABLED, introDelay, stagger } from '../../utils/intro.js'
import logo from '../../assets/logo/logo-black.svg'
import './Navbar.css'

// Page-load entrance: brand first, then each link left to right
const linkDelay = (index) => introDelay(100 + stagger(index, 60))

function Navbar() {
  return (
    <header className={`navbar${INTRO_ENABLED ? ' navbar--intro' : ''}`}>
      <Container className="navbar__inner">
        <Link to="/" className="navbar__brand" style={introDelay(0)}>
          <img src={logo} alt="" className="navbar__logo" />
          <span className="navbar__titles">
            <span className="navbar__title">2026 Website Portfolio</span>
            <span className="navbar__subtitle">Developed with React.js</span>
          </span>
        </Link>

        <nav aria-label="Main">
          <ul className="navbar__links">
            {navLinks.map(({ to, label }, index) => (
              <li key={to} style={linkDelay(index)}>
                <NavLink to={to} end={to === '/'} className="navbar__link">
                  {label}
                </NavLink>
              </li>
            ))}
            <li style={linkDelay(navLinks.length)}>
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
