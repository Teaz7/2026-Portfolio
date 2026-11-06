import { useRef, useState } from 'react'
import { ArrowRight, Download } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Tag from '../components/ui/Tag.jsx'
import Typewriter from '../components/ui/Typewriter.jsx'
import { site } from '../data/site.js'
import { getImage } from '../utils/images.js'
import { INTRO_DELAY, introDelay, playsIntro, stagger } from '../utils/intro.js'
import { revealDelay, useScrollReveal } from '../hooks/useScrollReveal.js'
import { useIntroSlideUp } from '../hooks/usePageEntrance.js'
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

/*
  Page-load timeline, in ms after the purple sweep reveals the page (INTRO_DELAY).
  Name types first; the course and year type after it while the bio wipes in and
  the photo slides in; then the tag rows and the resume row rise one after another.
*/
const NAME = 'Tyrell James Larroza'
const COURSE = 'Bachelor of Science in Information Technology, Majoring in Software Technology'
const YEARS = '2023 – 2027'

const nameTyping = { delay: 150, speed: 38 }
const courseTyping = { delay: 950, speed: 14 }
const yearsTyping = {
  delay: courseTyping.delay + COURSE.length * courseTyping.speed + 50,
  speed: 25,
}
const BODY_START = 950 // bio wipe + photo slide
const TAG_ROW_START = [1350, 1600]
const TAG_ROW_STEP = [70, 50]
const ACTIONS_START = 1950

const typing = ({ delay, speed }) => ({ delay: INTRO_DELAY + delay, speed })

/*
  Projects & Designs reveal, in ms after the black section covers the screen.
  Heading types, then the description; the button rises, then the tool icons
  rise in pairs from the middle outwards.
*/
const PROJECTS_TITLE = 'Projects & Designs'
const PROJECTS_TEXT =
  'A collection of mobile apps, web apps, UI designs, and prototypes I built for my IT courses. I commonly develop with Flutter and React.js, using tools such as GitHub, Visual Studio Code, Figma, and Draw.io.'
const titleTyping = { delay: 100, speed: 45 }
const textTyping = { delay: 100 + PROJECTS_TITLE.length * 45 + 150, speed: 7 }
const BUTTON_START = textTyping.delay + PROJECTS_TEXT.length * textTyping.speed - 150
const ICONS_START = BUTTON_START + 150
const ICON_STEP = 90

// `pairOf` gives each icon its distance from the middle of the row (0 = closest)
function IconGroup({ icons, pairOf }) {
  return (
    <ul className="home-projects__icons">
      {icons.map(({ src, name, height }, index) => (
        <li key={name} style={revealDelay(ICONS_START + stagger(pairOf(index), ICON_STEP))}>
          <img src={src} alt={name} title={name} style={{ height: `${height / 16}rem` }} />
        </li>
      ))}
    </ul>
  )
}

function Home() {
  // Only animate when Home is the first page of the visit
  const [intro] = useState(playsIntro)
  // Plays once the black section covers the screen (top within the top 5%); resets
  // when scrolled back up until its content is off-screen (top below 70%)
  const {
    ref: projectsRef,
    phase: projectsReveal,
    run: projectsRun,
  } = useScrollReveal({ playAt: 0.05, resetAt: 0.7 })

  // On a first load (smaller screens), the black section waits below the screen
  // until the sweep is gone
  const trackRef = useRef(null)
  useIntroSlideUp(trackRef)

  return (
    <>
      <Container
        as="section"
        className={`hero${intro ? ' hero--intro' : ''}`}
        aria-labelledby="hero-name"
      >
        <h1 id="hero-name" className="hero__name">
          <Typewriter text={NAME} play={intro} {...typing(nameTyping)} />
        </h1>
        <div className="hero__subtitle">
          <p>
            <Typewriter text={COURSE} play={intro} {...typing(courseTyping)} />
          </p>
          <p>
            <Typewriter text={YEARS} play={intro} {...typing(yearsTyping)} />
          </p>
        </div>

        <div className="hero__body">
          <div className="hero__content">
            <p className="hero__bio" style={introDelay(BODY_START)}>
              Greetings! I’m Tyrell, a 4th-year BSIT student from West Visayas State University,
              Iloilo City. I have a strong academic foundation with full-stack development and
              project management. I’m looking forward to improving and growing as a developer.
            </p>

            <div className="hero__tags">
              {[skills, tools].map((row, rowIndex) => (
                <ul key={rowIndex} className="tag-list hero__tag-row">
                  {row.map((tag, index) => (
                    <li
                      key={tag}
                      style={introDelay(
                        TAG_ROW_START[rowIndex] + stagger(index, TAG_ROW_STEP[rowIndex]),
                      )}
                    >
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <div className="hero__actions">
              <Button
                className="hero__resume"
                style={introDelay(ACTIONS_START)}
                href={site.resume.href} download={site.resume.fileName} icon={Download}>
                Download Resume
              </Button>
              <ul className="hero__socials">
                {socials.map(({ icon, href, name }, index) => (
                  <li key={name} style={introDelay(ACTIONS_START + stagger(index + 1, 70))}>
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
            style={introDelay(BODY_START)}
            src={getImage('profile/hero-picture.jpg')}
            alt="Tyrell James Larroza"
          />
        </div>
      </Container>

      {/* The track is taller than the section, so the section stays pinned for a
          short scroll before Contact comes up */}
      <div ref={trackRef} className="home-projects-track">
        <section
          ref={projectsRef}
          className={`home-projects home-projects--${projectsReveal}`}
          aria-labelledby="home-projects-title"
        >
          <Container className="home-projects__inner">
            <h2 id="home-projects-title" className="home-projects__title">
              <Typewriter
                key={projectsRun}
                text={PROJECTS_TITLE}
                play={projectsReveal !== 'done'}
                active={projectsReveal === 'play'}
                {...titleTyping}
              />
            </h2>
            <p className="home-projects__text">
              <Typewriter
                key={projectsRun}
                text={PROJECTS_TEXT}
                play={projectsReveal !== 'done'}
                active={projectsReveal === 'play'}
                {...textTyping}
              />
            </p>
            <div className="home-projects__row">
              <IconGroup icons={toolIcons} pairOf={(index) => toolIcons.length - 1 - index} />
              <Button
                className="home-projects__button"
                style={revealDelay(BUTTON_START)}
                to="/projects"
                icon={ArrowRight}
              >
                View My Projects
              </Button>
              <IconGroup icons={techIcons} pairOf={(index) => index} />
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Home
