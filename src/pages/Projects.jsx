import { Fragment } from 'react'
import Container from '../components/ui/Container.jsx'
import Tag from '../components/ui/Tag.jsx'
import Chip from '../components/ui/Chip.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import Carousel from '../components/ui/Carousel.jsx'
import { projectGroups, projects } from '../data/projects.js'
import { chunk, getImages } from '../utils/images.js'
import './Projects.css'

const projectsById = Object.fromEntries(projects.map((project) => [project.id, project]))

function SideItem({ label, children }) {
  return (
    <div className="project__side-item">
      <dt>{label}</dt>
      {children}
    </div>
  )
}

function ProjectSection({ project }) {
  const { carousel } = project
  const slides = chunk(getImages(project.images), carousel.perSlide)

  return (
    <section id={project.id} className="project" aria-labelledby={`${project.id}-title`}>
      <Container className="project__main">
        <div className="project__content">
          <div className="project__head">
            <h3 id={`${project.id}-title`} className="project__title">
              {project.name}
            </h3>
            <ul className="tag-list">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <p className="project__intro">{project.intro}</p>
          <ul className="project__bullets">
            {project.bullets.map((bullet) => {
              const { text, nowrap } = typeof bullet === 'string' ? { text: bullet } : bullet
              return (
                <li key={text} className={nowrap ? 'is-nowrap' : undefined}>
                  {text}
                </li>
              )
            })}
          </ul>
        </div>

        <dl className="project__side">
          <SideItem label="Context">
            <dd className={project.contextCompact ? 'is-compact' : undefined}>{project.context}</dd>
          </SideItem>
          <SideItem label="Roles">
            {project.roles.map((role) => (
              <dd key={role}>{role}</dd>
            ))}
          </SideItem>
          <SideItem label="Scope">
            {project.scope.map((item) => (
              <dd key={item}>{item}</dd>
            ))}
          </SideItem>
        </dl>
      </Container>

      <Carousel
        label={project.name}
        slides={slides}
        width={carousel.width}
        height={carousel.height}
        slideWidth={carousel.slideWidth}
        fit={carousel.fit}
        accent={carousel.accent}
      />
    </section>
  )
}

function Projects() {
  return (
    <div className="projects-page">
      <Container as="header" className="projects-header">
        <h1 className="projects-header__title">Featured Projects</h1>
        <nav aria-label="Jump to project">
          <ul className="chip-list">
            {projects.map((project) => (
              <li key={project.id}>
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
