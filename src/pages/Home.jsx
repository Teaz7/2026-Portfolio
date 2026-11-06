import { ArrowRight, Download } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Tag from '../components/ui/Tag.jsx'
import { site } from '../data/site.js'
import { getImage } from '../utils/images.js'
import linkedinIcon from '../assets/icons/home/linkedin-purple.svg'
import githubIcon from '../assets/icons/home/github-purple.svg'
import facebookIcon from '../assets/icons/home/facebook-purple.svg'
import githubWhite from '../assets/icons/home/github-white.svg'
import vscodeWhite from '../assets/icons/home/vscode-white.svg'
import figmaWhite from '../assets/icons/home/figma-white.svg'
import drawioWhite from '../assets/icons/home/drawio-white.svg'
import flutterWhite from '../assets/icons/home/flutter-white.svg'
import dartWhite from '../assets/icons/home/dart-white.svg'
import reactWhite from '../assets/icons/home/react-white.svg'
import javascriptWhite from '../assets/icons/home/javascript-white.svg'
import './Home.css'

const skills = ['AI Integration', 'Database Design & Management', 'Full-Stack Development', 'UI/UX Design']
const tools = ['GitHub', 'Figma', 'AWS', 'Flutter', 'SQL', 'Python', 'React.js', 'HTML/CSS']

const socials = [
  { icon: linkedinIcon, ...site.links.linkedin, name: 'LinkedIn' },
  { icon: githubIcon, ...site.links.github, name: 'GitHub' },
  { icon: facebookIcon, ...site.links.facebook, name: 'Facebook' },
]

// Heights in px from Figma; widths follow each icon's own proportions
const toolIcons = [
  { src: githubWhite, name: 'GitHub', height: 60 },
  { src: vscodeWhite, name: 'Visual Studio Code', height: 60 },
  { src: figmaWhite, name: 'Figma', height: 65 },
  { src: drawioWhite, name: 'Draw.io', height: 60 },
]

const techIcons = [
  { src: flutterWhite, name: 'Flutter', height: 60 },
  { src: dartWhite, name: 'Dart', height: 60 },
  { src: reactWhite, name: 'React', height: 60 },
  { src: javascriptWhite, name: 'JavaScript', height: 60 },
]

function IconGroup({ icons }) {
  return (
    <ul className="home-projects__icons">
      {icons.map(({ src, name, height }) => (
        <li key={name}>
          <img src={src} alt={name} title={name} style={{ height: `${height / 16}rem` }} />
        </li>
      ))}
    </ul>
  )
}

function Home() {
  return (
    <>
      <Container as="section" className="hero" aria-labelledby="hero-name">
        <h1 id="hero-name" className="hero__name">
          Tyrell James Larroza
        </h1>
        <div className="hero__subtitle">
          <p>Bachelor of Science in Information Technology, Majoring in Software Technology</p>
          <p>2023 – 2027</p>
        </div>

        <div className="hero__body">
          <div className="hero__content">
            <p className="hero__bio">
              Greetings! I’m Tyrell, a 4th-year BSIT student from West Visayas State University,
              Iloilo City. I have a strong academic foundation with full-stack development and
              project management. I’m looking forward to improving and growing as a developer.
            </p>

            <div className="hero__tags">
              {[skills, tools].map((row, index) => (
                <ul key={index} className="tag-list hero__tag-row">
                  {row.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <div className="hero__actions">
              <Button href={site.resume.href} download={site.resume.fileName} icon={Download}>
                Download Resume
              </Button>
              <ul className="hero__socials">
                {socials.map(({ icon, href, name }) => (
                  <li key={name}>
                    <a href={href} target="_blank" rel="noreferrer" aria-label={name}>
                      <img src={icon} alt="" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <img
            className="hero__photo"
            src={getImage('profile/hero-picture.jpg')}
            alt="Tyrell James Larroza"
          />
        </div>
      </Container>

      <section className="home-projects" aria-labelledby="home-projects-title">
        <Container className="home-projects__inner">
          <h2 id="home-projects-title" className="home-projects__title">
            Projects &amp; Designs
          </h2>
          <p className="home-projects__text">
            A collection of mobile apps, web apps, UI designs, and prototypes I built for my IT
            courses. I commonly develop with Flutter and React.js, using tools such as GitHub,
            Visual Studio Code, Figma, and Draw.io.
          </p>
          <div className="home-projects__row">
            <IconGroup icons={toolIcons} />
            <Button to="/projects" icon={ArrowRight}>
              View My Projects
            </Button>
            <IconGroup icons={techIcons} />
          </div>
        </Container>
      </section>
    </>
  )
}

export default Home
