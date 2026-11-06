import { Link, NavLink } from 'react-router-dom'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import { navLinks } from '../../data/site.js'
import logo from '../../assets/logo/logo-black.svg'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <Container className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <img src={logo} alt="" className="navbar__logo" />
          <span className="navbar__titles">
            <span className="navbar__title">2026 Website Portfolio</span>
            <span className="navbar__subtitle">Developed with React.js</span>
          </span>
        </Link>

        <nav aria-label="Main">
          <ul className="navbar__links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} className="navbar__link">
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
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
