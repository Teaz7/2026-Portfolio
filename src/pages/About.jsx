import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Tag from '../components/ui/Tag.jsx'
import Typewriter from '../components/ui/Typewriter.jsx'
import { getImage } from '../utils/images.js'
import { stagger } from '../utils/intro.js'
import { useIntroSlideUp, usePageEntrance } from '../hooks/usePageEntrance.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { useStickyFit } from '../hooks/useCover.js'
import { useScreenSize } from '../hooks/useScreenSize.js'
import timelinePath from '../assets/icons/about/timeline-path.svg'
import timelineArrow from '../assets/icons/about/timeline-arrow.svg'
import timelineLine from '../assets/icons/about/timeline-line.svg'
import './About.css'

// Rows as laid out in Figma
const technologies = [
  ['Python', 'C++', 'C#', 'HTML/CSS', 'Java', 'Dart', 'JavaScript'],
  ['Flutter', 'React.js', 'GDScript', 'AWS Lambda', 'AWS S3', 'Git/GitHub'],
  ['MySQL', 'SQLite', 'Supabase', 'Assembly AI', 'Gemini AI', 'REST API'],
]

const coursework = [
  [
    'Applications Development & Emerging Technologies',
    'Client Server Technologies and Applications',
    'Computer Programming 1 & 2',
  ],
  [
    'Data Structures and Algorithms',
    'Fundamentals of Database Systems',
    'Fundamentals of Multimedia Systems',
    'Human-Computer Interaction 1 & 2',
  ],
  [
    'Information Management',
    'Integrative Programming and Technologies',
    'Mobile Applications Development',
    'Object-Oriented Programming',
  ],
  [
    'Open Source Programming',
    'Platform Technologies',
    'Software Engineering',
    'Software Project Management',
    'Systems Analysis and Design',
  ],
  [
    'Systems Integration and Architecture',
    'Web Services and Cloud Computing',
    'Web Systems and Technologies',
  ],
]

const INTRO_TEXT =
  'I’m a 4th-year BSIT student and DOST scholar from West Visayas State University, Iloilo City, and I like developing applications and designing UI/UX.'
const TECH_LABEL = 'Technologies I’ve Worked With'
const HISTORY_LABEL = 'From High-School Curiosity to College Projects'
const COURSEWORK_LABEL = 'Relevant Coursework'

const story = {
  left: [
    'My interest in programming began back in 2017 when our ICT class taught us to create simple animations and develop games with blocks in Scratch.',
    'In 2018, I joined my high school robotics club and developed more interest in programming. This grew when I discovered Arduino in 2019, which we discussed in our ICT and robotics classes until 2021.',
    'When I was about to enter college in 2023, I started teaching myself C++ through Sololearn.',
    'In 2023 and 2024, I joined game dev competitions with some of my high school friends. We mainly developed using Godot and Aseprite.',
  ],
  right: [
    'In 2025, we began developing major projects for our courses. Our lessons progressed from simple programs and algorithms to UI/UX design in Figma and full-stack web and mobile development.',
    'In 2026, we began development for our thesis application and I was appointed Lead Developer. I learned API and cloud service integration, with the help of Claude AI and Google as my learning tool. On October 22, 2026, we successfully passed our thesis defense.',
  ],
}

/*
  Timeline positions in px, measured from the top-left of the Figma "History" frame
  (1760×286). Row 1 runs left to right, the purple path loops back, row 2 continues.
*/
const milestones = [
  { label: 'Scratch', years: '2017 – 2018', left: 0, row: 1, yearsCenter: 96 },
  { label: 'Makeblock', years: '2018', left: 443, row: 1, yearsCenter: 564 },
  { label: 'Arduino', years: '2019 – 2021', left: 934, row: 1, yearsCenter: 1031.5 },
  { label: 'Sololearn', years: '2023', left: 1378, row: 1, yearsCenter: 1486 },
  { label: 'Game Dev Competitions', years: '2023 – 2024', left: 193, row: 2, yearsCenter: 416 },
  { label: 'Major IT Projects', years: '2025 – 2026', left: 888, row: 2, yearsCenter: 1054 },
  { label: 'Thesis', years: '2026', left: 1470, row: 2, yearsCenter: 1559 },
]

// Short lines between chips: [left, row, index of the milestone before it]
const connectors = [
  [217, 1, 0],
  [708, 1, 1],
  [1152, 1, 2],
  [662, 2, 4],
  [1244, 2, 5],
]

/*
  The looping path is one brush-stroke shape, so it's "drawn" as 5 copies, each
  clipped to one stretch and wiped open in the direction of travel: right from
  Sololearn, down the right edge, all the way back left, down, then right to the
  arrow. Coordinates are in the path image's own px (1763.56 × 122.72).
*/
const PATH_W = 1763.56
const PATH_H = 122.72
const pathSegments = [
  { x: [1580, PATH_W], y: [0, 24], direction: 'right' },
  { x: [1735, PATH_W], y: [0, 72], direction: 'down' },
  { x: [0, PATH_W], y: [46, 72], direction: 'left' },
  { x: [0, 28], y: [46, PATH_H], direction: 'down' },
  { x: [0, 175], y: [100, PATH_H], direction: 'right' },
]

const percent = (value, total) => `${((value / total) * 100).toFixed(3)}%`

function segmentClip({ x: [x0, x1], y: [y0, y1], direction }) {
  const inset = (top, right, bottom, left) =>
    `inset(${percent(top, PATH_H)} ${percent(right, PATH_W)} ${percent(bottom, PATH_H)} ${percent(left, PATH_W)})`
  const to = inset(y0, PATH_W - x1, PATH_H - y1, x0)
  const from = {
    right: inset(y0, PATH_W - x0, PATH_H - y1, x0),
    left: inset(y0, PATH_W - x1, PATH_H - y1, x1),
    down: inset(y0, PATH_W - x1, PATH_H - y0, x0),
  }[direction]
  return { from, to, length: direction === 'down' ? y1 - y0 : x1 - x0 }
}

/*
  Timeline reveal, in ms after it scrolls into view: the label types, then each
  milestone slides in with its years typing, and the line to the next one draws.
  After Sololearn the long path draws, the arrow appears, and row 2 continues.
*/
const HISTORY_LABEL_SPEED = 20
const TIMELINE_START = 500
const MILESTONE_STEP = 450
const LINE_DELAY = 250 // after its milestone starts
const PATH_SPEED = 2.4 // px per ms

function timelineSchedule() {
  const milestoneAt = []
  let time = TIMELINE_START
  for (let index = 0; index < 4; index++) {
    milestoneAt.push(time)
    time += MILESTONE_STEP
  }
  let pathTime = milestoneAt[3] + LINE_DELAY
  const segments = pathSegments.map((segment) => {
    const clip = segmentClip(segment)
    const duration = Math.round(clip.length / PATH_SPEED)
    const scheduled = { ...clip, start: pathTime, duration }
    pathTime += duration
    return scheduled
  })
  const arrowAt = pathTime - 100
  time = pathTime
  for (let index = 4; index < milestones.length; index++) {
    milestoneAt.push(time)
    time += MILESTONE_STEP
  }
  return { milestoneAt, segments, arrowAt }
}

const schedule = timelineSchedule()
const TIMELINE_DURATION = schedule.milestoneAt.at(-1) + 500

/*
  Tablet/phone: the diagram doesn't fit, so the milestones stack in a column (chip,
  then its years) joined by short vertical strokes. Each milestone slides in with
  its years typing, then the stroke down to the next one draws.
*/
const STACK_STEP = 380

const stackSchedule = milestones.map((_, index) => TIMELINE_START + index * STACK_STEP)
const STACK_DURATION = stackSchedule.at(-1) + 500

function StackedTimeline({ phase, run, wait }) {
  const animated = phase !== 'done'
  return (
    <ol className="timeline-stack">
      {milestones.map(({ label, years }, index) => (
        <li key={label} className="timeline-stack__item">
          <span className="timeline__chip" style={ms(wait + stackSchedule[index])}>
            {label}
          </span>
          <span className="timeline__years">
            <Typewriter
              key={run}
              text={years}
              play={animated}
              active={phase === 'play'}
              delay={wait + stackSchedule[index] + 150}
              speed={45}
            />
          </span>
          {index < milestones.length - 1 && (
            <img
              className="timeline__line timeline-stack__line"
              src={timelineLine}
              alt=""
              style={ms(wait + stackSchedule[index] + LINE_DELAY)}
            />
          )}
        </li>
      ))}
    </ol>
  )
}

const px = (value) => `${value / 16}rem`
const ms = (value) => ({ animationDelay: `${value}ms` })

function Timeline({ phase, run, wait }) {
  const animated = phase !== 'done'
  const at = (value) => ms(wait + value)

  return (
    <div className="timeline">
      {animated ? (
        schedule.segments.map(({ from, to, start, duration }) => (
          <img
            key={to}
            className="timeline__path timeline__path--segment"
            src={timelinePath}
            alt=""
            style={{
              clipPath: to,
              '--clip-from': from,
              '--clip-to': to,
              animationDelay: `${wait + start}ms`,
              animationDuration: `${duration}ms`,
            }}
          />
        ))
      ) : (
        <img className="timeline__path" src={timelinePath} alt="" />
      )}
      <img
        className="timeline__arrow"
        src={timelineArrow}
        alt=""
        style={at(schedule.arrowAt)}
      />
      {connectors.map(([left, row, after]) => (
        <img
          key={`${left}-${row}`}
          className={`timeline__line timeline__line--row${row}`}
          src={timelineLine}
          alt=""
          style={{ left: px(left), ...at(schedule.milestoneAt[after] + LINE_DELAY) }}
        />
      ))}
      <ol className="timeline__list">
        {milestones.map(({ label, years, left, row, yearsCenter }, index) => (
          <li key={label}>
            <span
              className={`timeline__chip timeline__chip--row${row}`}
              style={{ left: px(left), ...at(schedule.milestoneAt[index]) }}
            >
              {label}
            </span>
            <span
              className={`timeline__years timeline__years--row${row}`}
              style={{ left: px(yearsCenter) }}
            >
              <Typewriter
                key={run}
                text={years}
                play={animated}
                active={phase === 'play'}
                delay={wait + schedule.milestoneAt[index] + 150}
                speed={45}
              />
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/*
  Intro timeline (like the Home hero), in ms after the page appears: "About Me:" and
  "Tyrell" type, the text wipes in while the photo slides in, the label types, then
  the tag rows rise one after another.
*/
const intro = {
  title: { delay: 150, speed: 45 },
  name: { delay: 600, speed: 60 },
  body: 700,
  label: { delay: 1100, speed: 20 },
  rows: 1350,
  rowStep: 250,
  tagStep: 50,
}
const INTRO_DURATION = intro.rows + 2 * intro.rowStep + stagger(6, intro.tagStep) + 550

/*
  Story: as soon as it comes into view, every paragraph starts typing (each a moment
  after the previous one, in reading order: left column, then right), and the button
  slides in when they're done. It only resets once you're back at the top of the
  page, so scrolling up a little and down again keeps the text.
*/
const STORY_SPEED = 4
const PARAGRAPH_STEP = 150

const storyStarts = [...story.left, ...story.right].map((_, index) => index * PARAGRAPH_STEP)
const storyStart = (side, index) => storyStarts[side === 'left' ? index : story.left.length + index]
const STORY_DONE = Math.max(
  ...[...story.left, ...story.right].map((text, index) => storyStarts[index] + text.length * STORY_SPEED),
)

// Coursework reveal: the label types, then each row's tags slide in from the left
const courseTiming = { label: 30, rows: 450, rowStep: 300, tagStep: 70 }

function About() {
  const stacked = useScreenSize() !== 'desktop'
  const start = usePageEntrance(INTRO_DURATION)
  const animated = start !== null
  const introAt = (value) => ms((start ?? 0) + value)
  const typing = (text, { delay, speed }) => (
    <Typewriter text={text} play={animated} delay={(start ?? 0) + delay} speed={speed} />
  )

  // The intro stays in place while the dark section slides over it (like Home)
  const introRef = useRef(null)
  useStickyFit(introRef)

  // The timeline plays as it scrolls into view (its top 75% down the screen). Each
  // part holds back the ones below it until it's done.
  const { ref: historyRef, ...history } = useScrollReveal({
    playAt: 0.75,
    resetAt: 1,
    holdFor: stacked ? STACK_DURATION : TIMELINE_DURATION,
  })
  const { ref: storyRef, ...storyReveal } = useScrollReveal({
    playAt: 0.95,
    resetAtTop: true,
    holdFor: STORY_DONE + 550,
  })
  const { ref: coursesRef, ...courses } = useScrollReveal({ playAt: 0.85, resetAt: 1 })

  // On a first load, the dark section waits below the screen until the sweep is gone
  const historySectionRef = useRef(null)
  useIntroSlideUp(historySectionRef)

  const typed = (reveal, text, delay, speed) => (
    <Typewriter
      key={reveal.run}
      text={text}
      play={reveal.phase !== 'done'}
      active={reveal.phase === 'play'}
      delay={reveal.wait + delay}
      speed={speed}
    />
  )

  return (
    <>
      <Container
        ref={introRef}
        as="section"
        className={`about-intro${animated ? ' about-intro--play' : ''}`}
        aria-labelledby="about-title"
      >
        <h1 id="about-title" className="about-intro__title">
          <span>{typing('About Me:', intro.title)}</span>
          <span className="about-intro__name">{typing('Tyrell', intro.name)}</span>
        </h1>

        <div className="about-intro__body">
          <div className="about-intro__content">
            <p className="about-intro__text" style={introAt(intro.body)}>
              {INTRO_TEXT}
            </p>
            <h2 className="about-label">{typing(TECH_LABEL, intro.label)}</h2>
            <div className="about-intro__tags">
              {technologies.map((row, rowIndex) => (
                <ul key={row[0]} className="tag-list about-tag-row">
                  {row.map((tech, index) => (
                    <li
                      key={tech}
                      style={introAt(
                        intro.rows + rowIndex * intro.rowStep + stagger(index, intro.tagStep),
                      )}
                    >
                      <Tag>{tech}</Tag>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <img
            className="about-intro__photo"
            src={getImage('profile/hero-picture.jpg')}
            alt="Tyrell James Larroza"
            style={introAt(intro.body)}
          />
        </div>
      </Container>

      <section ref={historySectionRef} className="about-history" aria-labelledby="history-title">
        <div
          ref={historyRef}
          className={`about-history__track about-timeline about-timeline--${history.phase}`}
        >
          <Container className="about-history__stage">
            <h2 id="history-title" className="about-label">
              {typed(history, HISTORY_LABEL, 0, HISTORY_LABEL_SPEED)}
            </h2>
            {stacked ? (
              <StackedTimeline phase={history.phase} run={history.run} wait={history.wait} />
            ) : (
              <Timeline phase={history.phase} run={history.run} wait={history.wait} />
            )}
          </Container>
        </div>

        <Container>
          <div
            ref={storyRef}
            className={`about-history__story about-story--${storyReveal.phase}`}
          >
            <div className="about-history__column">
              {story.left.map((text, index) => (
                <p key={text}>
                  {typed(storyReveal, text, storyStart('left', index), STORY_SPEED)}
                </p>
              ))}
            </div>
            <div className="about-history__column about-history__column--right">
              {story.right.map((text, index) => (
                <p key={text}>
                  {typed(storyReveal, text, storyStart('right', index), STORY_SPEED)}
                </p>
              ))}
              <div className="about-story__button" style={ms(storyReveal.wait + STORY_DONE)}>
                <Button to="/projects" icon={ArrowRight}>
                  Check out my projects
                </Button>
              </div>
            </div>
          </div>

          <div ref={coursesRef} className={`about-courses about-courses--${courses.phase}`}>
            <h2 className="about-label about-history__coursework-label">
              {typed(courses, COURSEWORK_LABEL, 0, courseTiming.label)}
            </h2>
            <div className="about-coursework">
              {coursework.map((row, rowIndex) => (
                <ul key={row[0]} className="tag-list about-tag-row about-coursework__row">
                  {row.map((course, index) => (
                    <li
                      key={course}
                      style={ms(
                        courses.wait +
                          courseTiming.rows +
                          rowIndex * courseTiming.rowStep +
                          stagger(index, courseTiming.tagStep),
                      )}
                    >
                      <Tag tone="light">{course}</Tag>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default About
