import { Fragment, useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Tag from '../components/ui/Tag.jsx'
import Chip from '../components/ui/Chip.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import Carousel from '../components/ui/Carousel.jsx'
import Typewriter from '../components/ui/Typewriter.jsx'
import { useDealOffsets, usePageEntrance } from '../hooks/usePageEntrance.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { useCoverProgress, useStickyFit } from '../hooks/useCover.js'
import { stagger } from '../utils/intro.js'
import { projectGroups, projects } from '../data/projects.js'
import { chunk, getImages } from '../utils/images.js'
import './Projects.css'

const projectsById = Object.fromEntries(projects.map((project) => [project.id, project]))

/*
  Header entrance, in ms after the page appears: the title types, then the jump
  chips deal out left to right, each sliding out from behind the previous one.
*/
const TITLE = 'Featured Projects'
const TITLE_TYPING = { delay: 100, speed: 45 }
const CHIPS_START = TITLE_TYPING.delay + TITLE.length * TITLE_TYPING.speed + 100
const CHIP_STEP = 110
const HEADER_DURATION = CHIPS_START + stagger(projects.length - 1, CHIP_STEP) + 300

/*
  Project reveal, in ms after the project scrolls into view: the title types, the
  tags deal out like the header chips, the purple intro wipes in, then each bullet's
  diamond turns and its text slides in, while the sidebar items slide in.
*/
const TITLE_SPEED = 40
const TAG_STEP = 90
const BULLET_STEP = 170
const SIDE_STEP = 150
const CAROUSEL_ENTER = 0.3 // carousel comes in over this much scrolling (screen heights)

function projectTimeline(name) {
  const tags = name.length * TITLE_SPEED + 50
  const intro = tags + 150
  const bullets = intro + 450
  return { tags, intro, bullets, side: bullets + 100 }
}

function SideItem({ label, style, children }) {
  return (
    <div className="project__side-item" style={style}>
      <dt>{label}</dt>
      {children}
    </div>
  )
}

function ProjectSection({ project }) {
  const { carousel } = project
  const slides = chunk(getImages(project.images), carousel.perSlide)
  const time = projectTimeline(project.name)

  // Content reveal (replays after scrolling back up above it)
  const { ref: mainRef, phase, run, wait } = useScrollReveal({ playAt: 0.75, resetAt: 1 })
  const delay = (ms) => ({ animationDelay: `${wait + ms}ms` })
  const tagsRef = useDealOffsets()

  // The content stays in place while the carousel's black band slides over it
  const trackRef = useRef(null)
  const stageRef = useRef(null)
  useStickyFit(mainRef)
  useStickyFit(stageRef)
  useCoverProgress(trackRef, CAROUSEL_ENTER)

  return (
    <section
      id={project.id}
      className={`project project--${phase}`}
      aria-labelledby={`${project.id}-title`}
    >
      <Container ref={mainRef} className="project__main">
        <div className="project__content">
          <div className="project__head">
            <h3 id={`${project.id}-title`} className="project__title">
              <Typewriter
                key={run}
                text={project.name}
                play={phase !== 'done'}
                active={phase === 'play'}
                delay={wait}
                speed={TITLE_SPEED}
              />
            </h3>
            <ul ref={tagsRef} className="tag-list">
              {project.tags.map((tag, index) => (
                <li key={tag} style={delay(time.tags + stagger(index, TAG_STEP))}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <p className="project__intro" style={delay(time.intro)}>
            {project.intro}
          </p>
          <ul className="project__bullets">
            {project.bullets.map((bullet, index) => {
              const { text, nowrap } = typeof bullet === 'string' ? { text: bullet } : bullet
              const bulletDelay = wait + time.bullets + stagger(index, BULLET_STEP)
              return (
                <li
                  key={text}
                  className={nowrap ? 'is-nowrap' : undefined}
                  style={{ '--bullet-delay': `${bulletDelay}ms` }}
                >
                  <span>{text}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <dl className="project__side">
          <SideItem label="Context" style={delay(time.side)}>
            <dd className={project.contextCompact ? 'is-compact' : undefined}>{project.context}</dd>
          </SideItem>
          <SideItem label="Roles" style={delay(time.side + SIDE_STEP)}>
            {project.roles.map((role) => (
              <dd key={role}>{role}</dd>
            ))}
          </SideItem>
          <SideItem label="Scope" style={delay(time.side + stagger(2, SIDE_STEP))}>
            {project.scope.map((item) => (
              <dd key={item}>{item}</dd>
            ))}
          </SideItem>
        </dl>
      </Container>

      {/* Black band: covers the screen, stays pinned while the carousel comes in */}
      <div ref={trackRef} className="project__track">
        <div ref={stageRef} className="project__stage">
          <div className="project__carousel">
            <Carousel
              label={project.name}
              slides={slides}
              width={carousel.width}
              height={carousel.height}
              slideWidth={carousel.slideWidth}
              fit={carousel.fit}
              accent={carousel.accent}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const start = usePageEntrance(HEADER_DURATION)
  const chipsRef = useDealOffsets()

  return (
    <div className="projects-page">
      <Container
        as="header"
        className={`projects-header${start === null ? '' : ' page-entrance'}`}
      >
        <h1 className="projects-header__title">
          <Typewriter
            text={TITLE}
            play={start !== null}
            delay={(start ?? 0) + TITLE_TYPING.delay}
            speed={TITLE_TYPING.speed}
          />
        </h1>
        <nav aria-label="Jump to project">
          <ul ref={chipsRef} className="chip-list">
            {projects.map((project, index) => (
              <li
                key={project.id}
                style={{
                  animationDelay: `${(start ?? 0) + CHIPS_START + stagger(index, CHIP_STEP)}ms`,
                }}
              >
                <Chip href={`#${project.id}`}>
                  {project.id === 'portfolio' ? 'Portfolio' : project.name}
                </Chip>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {projectGroups.map((group) => (
        <Fragment key={group.label}>
          <Container className="projects-group-label">
            <SectionLabel>{group.label}</SectionLabel>
          </Container>
          {group.ids.map((id) => (
            <ProjectSection key={id} project={projectsById[id]} />
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default Projects
