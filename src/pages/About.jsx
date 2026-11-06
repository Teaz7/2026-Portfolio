import { ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Tag from '../components/ui/Tag.jsx'
import { getImage } from '../utils/images.js'
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

// Short lines between chips: [left, row]
const connectors = [
  [217, 1],
  [708, 1],
  [1152, 1],
  [662, 2],
  [1244, 2],
]

const px = (value) => `${value / 16}rem`

function Timeline() {
  return (
    <div className="timeline">
      <img className="timeline__path" src={timelinePath} alt="" />
      <img className="timeline__arrow" src={timelineArrow} alt="" />
      {connectors.map(([left, row]) => (
        <img
          key={`${left}-${row}`}
          className={`timeline__line timeline__line--row${row}`}
          src={timelineLine}
          alt=""
          style={{ left: px(left) }}
        />
      ))}
      <ol className="timeline__list">
        {milestones.map(({ label, years, left, row, yearsCenter }) => (
          <li key={label}>
            <span className={`timeline__chip timeline__chip--row${row}`} style={{ left: px(left) }}>
              {label}
            </span>
            <span
              className={`timeline__years timeline__years--row${row}`}
              style={{ left: px(yearsCenter) }}
            >
              {years}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function About() {
  return (
    <>
      <Container as="section" className="about-intro" aria-labelledby="about-title">
        <h1 id="about-title" className="about-intro__title">
          <span>About Me:</span>
          <span className="about-intro__name">Tyrell</span>
        </h1>

        <div className="about-intro__body">
          <div className="about-intro__content">
            <p className="about-intro__text">
              I’m a 4th-year BSIT student and DOST scholar from West Visayas State University,
              Iloilo City, and I like developing applications and designing UI/UX.
            </p>
            <h2 className="about-label">Technologies I’ve Worked With</h2>
            <div className="about-intro__tags">
              {technologies.map((row) => (
                <ul key={row[0]} className="tag-list about-tag-row">
                  {row.map((tech) => (
                    <li key={tech}>
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
          />
        </div>
      </Container>

      <section className="about-history" aria-labelledby="history-title">
        <Container>
          <h2 id="history-title" className="about-label">
            From High-School Curiosity to College Projects
          </h2>
          <Timeline />

          <div className="about-history__story">
            <div className="about-history__column">
              <p>
                My interest in programming began back in 2017 when our ICT class taught us to
                create simple animations and develop games with blocks in Scratch.
              </p>
              <p>
                In 2018, I joined my high school robotics club and developed more interest in
                programming. This grew when I discovered Arduino in 2019, which we discussed in
                our ICT and robotics classes until 2021.
              </p>
              <p>
                When I was about to enter college in 2023, I started teaching myself C++ through
                Sololearn.
              </p>
              <p>
                In 2023 and 2024, I joined game dev competitions with some of my high school
                friends. We mainly developed using Godot and Aseprite.
              </p>
            </div>
            <div className="about-history__column about-history__column--right">
              <p>
                In 2025, we began developing major projects for our courses. Our lessons
                progressed from simple programs and algorithms to UI/UX design in Figma and
                full-stack web and mobile development.
              </p>
              <p>
                In 2026, we began development for our thesis application and I was appointed
                Lead Developer. I learned API and cloud service integration, with the help of
                Claude AI and Google as my learning tool. On October 22, 2026, we successfully
                passed our thesis defense.
              </p>
              <div>
                <Button to="/projects" icon={ArrowRight}>
                  Check out my projects
                </Button>
              </div>
            </div>
          </div>

          <h2 className="about-label about-history__coursework-label">Relevant Coursework</h2>
          <div className="about-coursework">
            {coursework.map((row) => (
              <ul key={row[0]} className="tag-list about-tag-row about-coursework__row">
                {row.map((course) => (
                  <li key={course}>
                    <Tag tone="light">{course}</Tag>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}

export default About
