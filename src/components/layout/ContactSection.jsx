import { Download, Mail } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import SectionLabel from '../ui/SectionLabel.jsx'
import MaskIcon from '../ui/MaskIcon.jsx'
import { site } from '../../data/site.js'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import githubIcon from '../../assets/icons/github.svg'
import './ContactSection.css'

// Purple "Let's Connect!" section + footer, shown at the bottom of every page
function ContactSection() {
  const { linkedin, github } = site.links

  return (
    <footer id="contact" className="contact" data-cursor="light">
      <Container className="contact__inner">
        <div className="contact__main">
          <SectionLabel tone="light">Contact</SectionLabel>
          <p className="contact__heading">Let’s Connect!</p>
          <ul className="contact__links">
            <li>
              <a href={linkedin.href} target="_blank" rel="noreferrer">
                <MaskIcon src={linkedinIcon} size="1.25rem" />
                {linkedin.label}
              </a>
            </li>
            <li>
              <a href={github.href} target="_blank" rel="noreferrer">
                <MaskIcon src={githubIcon} size="1.25rem" />
                {github.label}
              </a>
            </li>
          </ul>
        </div>

        <div className="contact__aside">
          <p className="contact__pitch">
            I’m currently looking for an OJT opportunity in software development. Feel free to
            reach out.
          </p>
          <div className="contact__actions">
            <Button href={`mailto:${site.email}`} variant="light" size="md" shape="soft" icon={Mail}>
              {site.email}
            </Button>
            <Button
              href={site.resume.href}
              download={site.resume.fileName}
              variant="dark"
              size="md"
              shape="soft"
              icon={Download}
            >
              Download Resume
            </Button>
          </div>
          <p className="contact__availability">{site.availability}</p>
        </div>
      </Container>

      <Container>
        <p className="contact__copyright">© 2026 {site.name} • Built with React.js</p>
      </Container>
    </footer>
  )
}

export default ContactSection
