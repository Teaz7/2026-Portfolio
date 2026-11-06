import { useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Tag from '../components/ui/Tag.jsx'
import Chip from '../components/ui/Chip.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import Lightbox from '../components/ui/Lightbox.jsx'
import {
  awardNotes,
  awards,
  certificateGroups,
  competitions,
  gwaRanges,
  jumpLinks,
  linkExe,
  webinarCoHost,
} from '../data/experiences.js'
import { getImage } from '../utils/images.js'
import './Experiences.css'

const fileName = (path) => path.split('/').pop().replace(/\.\w+$/, '').replaceAll('-', ' ')

// Lightbox items for a list of image paths. Game screenshots are pixel art.
const toItems = (paths, label, { pixelated = false } = {}) =>
  paths.map((path) => ({
    src: getImage(path),
    alt: `${label}: ${fileName(path)}`,
    pixelated: pixelated && path.endsWith('.png'),
  }))

// Holds the lightbox state for one gallery; children render the tiles with open(index)
function LightboxGroup({ items, children }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <>
      {children((index) => setOpenIndex(index))}
      {openIndex !== null && (
        <Lightbox
          items={items}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  )
}

function Tile({ item, onOpen, className = '' }) {
  return (
    <button className={`exp-tile ${className}`.trim()} onClick={onOpen}>
      <img src={item.src} alt={item.alt} className={item.pixelated ? 'is-pixelated' : undefined} />
    </button>
  )
}

function Bullets({ items }) {
  return (
    <ul className="exp-bullets">
      {items.map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  )
}

function SideList({ items, className = '' }) {
  return (
    <dl className={`exp-side ${className}`.trim()}>
      {items.map(({ label, values, small }) => (
        <div key={label} className="exp-side__item">
          <dt>{label}</dt>
          {values.map((value) => (
            <dd key={value} className={small ? 'is-small' : undefined}>
              {value}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  )
}

function RichText({ parts }) {
  return parts.map((part, index) =>
    typeof part === 'string' ? part : <em key={index}>{part.italic}</em>,
  )
}

// Game jam entry: poster on the left, 2×3 grid of screenshots on the right
function CompetitionEntry({ entry }) {
  const items = toItems([entry.poster, ...entry.images], entry.award, { pixelated: true })
  const [poster, ...grid] = items

  return (
    <section className="exp-entry exp-entry--game" aria-labelledby={`${entry.id}-title`}>
      <Container className="exp-entry__main">
        <div className="exp-entry__content">
          <div className="exp-head exp-head--game">
            <h3 id={`${entry.id}-title`} className="exp-head__title">
              {entry.award}
            </h3>
            {entry.category && <p className="exp-head__category">{entry.category}</p>}
            <p className="exp-head__event">{entry.event}</p>
          </div>
          <p className="exp-intro">
            <RichText parts={entry.intro} />
          </p>
          <Bullets items={entry.bullets} />
        </div>
        <SideList items={entry.side} />
      </Container>

      <div className="exp-band">
        <LightboxGroup items={items}>
          {(open) => (
            <div className="exp-gallery-poster">
              <Tile item={poster} onOpen={() => open(0)} className="exp-gallery-poster__poster" />
              <div className="exp-gallery-poster__grid">
                {grid.map((item, index) => (
                  <Tile key={item.src} item={item} onOpen={() => open(index + 1)} />
                ))}
              </div>
            </div>
          )}
        </LightboxGroup>
      </div>
    </section>
  )
}

function AwardsSection() {
  return (
    <Container className="exp-awards">
      <dl className="exp-awards__list">
        {awards.map(({ name, year }, index) => (
          <div key={`${name}-${index}`} className="exp-awards__row">
            <dt>{name}</dt>
            <dd>{year}</dd>
          </div>
        ))}
      </dl>

      <div className="exp-awards__side">
        <div className="exp-awards__note">
          <p className="exp-awards__note-label">GWA Range</p>
          <dl className="exp-awards__gwa">
            {gwaRanges.map(({ tier, range }) => (
              <div key={tier}>
                <dt>{tier}</dt>
                <dd>{range}</dd>
              </div>
            ))}
          </dl>
        </div>
        {awardNotes.map(({ label, text }) => (
          <div key={label} className="exp-awards__note">
            <p className="exp-awards__note-label">{label}</p>
            <p className="exp-awards__note-text">{text}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}

function LinkExeEntry() {
  const tall = toItems(linkExe.tall, linkExe.name)
  const grid = toItems(linkExe.grid, linkExe.name)
  const items = [...tall, ...grid]

  return (
    <section className="exp-entry exp-entry--link" aria-labelledby="link-exe-title">
      <Container className="exp-entry__main">
        <div className="exp-entry__content">
          <div className="exp-head">
            <h3 id="link-exe-title" className="exp-head__title">
              {linkExe.name}
            </h3>
            <ul className="tag-list exp-head__tags">
              {linkExe.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <p className="exp-intro">{linkExe.intro}</p>
          <Bullets items={linkExe.bullets} />
        </div>
        <SideList items={linkExe.side} className="exp-side--wide" />
      </Container>

      <div className="exp-band">
        <LightboxGroup items={items}>
          {(open) => (
            <figure className="exp-gallery-link">
              <div className="exp-gallery-link__photos">
                <div className="exp-gallery-link__tall">
                  {tall.map((item, index) => (
                    <Tile key={item.src} item={item} onOpen={() => open(index)} />
                  ))}
                </div>
                <div className="exp-gallery-link__grid">
                  {grid.map((item, index) => (
                    <Tile key={item.src} item={item} onOpen={() => open(tall.length + index)} />
                  ))}
                </div>
              </div>
              <figcaption>{linkExe.credit}</figcaption>
            </figure>
          )}
        </LightboxGroup>
      </div>
    </section>
  )
}

function WebinarEntry() {
  const items = toItems(webinarCoHost.images, webinarCoHost.name)

  return (
    <section className="exp-entry exp-entry--webinar" aria-labelledby="webinar-title">
      <Container className="exp-entry__main">
        <div className="exp-entry__content">
          <div className="exp-head">
            <h3 id="webinar-title" className="exp-head__title">
              {webinarCoHost.name}
            </h3>
            <ul className="tag-list exp-head__tags">
              {webinarCoHost.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <p className="exp-intro">{webinarCoHost.intro}</p>
          <Bullets items={webinarCoHost.bullets} />
        </div>
        <SideList items={webinarCoHost.side} />
      </Container>

      <div className="exp-band">
        <LightboxGroup items={items}>
          {(open) => (
            <div className="exp-gallery-webinar">
              {items.map((item, index) => (
                <Tile key={item.src} item={item} onOpen={() => open(index)} />
              ))}
            </div>
          )}
        </LightboxGroup>
      </div>
    </section>
  )
}

function CertificateGroup({ group }) {
  const items = group.items.map(({ caption, label, image }) => ({
    src: getImage(image),
    alt: `${group.title}: ${caption ?? label}`,
    caption,
  }))

  return (
    <section className="exp-certs" aria-label={group.title}>
      <Container>
        <h3 className="exp-certs__title">{group.title}</h3>
      </Container>
      <LightboxGroup items={items}>
        {(open) => (
          <ul className={`exp-certs__grid exp-certs__grid--${group.size}`}>
            {items.map((item, index) => (
              <li key={item.src}>
                {item.caption && <p className="exp-certs__caption">{item.caption}</p>}
                <Tile item={item} onOpen={() => open(index)} />
              </li>
            ))}
          </ul>
        )}
      </LightboxGroup>
    </section>
  )
}

function Experiences() {
  return (
    <div className="experiences-page">
      <Container as="header" className="exp-header">
        <h1 className="exp-header__title">Experiences ’23–’26</h1>
        <nav aria-label="Jump to section">
          <ul className="chip-list">
            {jumpLinks.map(({ id, label }) => (
              <li key={id}>
                <Chip href={`#${id}`}>{label}</Chip>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container id="competitions" className="exp-label">
        <SectionLabel>Game Dev Competitions</SectionLabel>
      </Container>
      {competitions.map((entry) => (
        <CompetitionEntry key={entry.id} entry={entry} />
      ))}

      <Container id="awards" className="exp-label">
        <SectionLabel>Academic &amp; Non-Academic Awards</SectionLabel>
      </Container>
      <AwardsSection />

      <Container id="leadership" className="exp-label">
        <SectionLabel>Leadership &amp; Involvement</SectionLabel>
      </Container>
      <LinkExeEntry />
      <WebinarEntry />

      <Container id="learning" className="exp-label">
        <SectionLabel>Learning &amp; Development</SectionLabel>
      </Container>
      {certificateGroups.map((group) => (
        <CertificateGroup key={group.title} group={group} />
      ))}
    </div>
  )
}

export default Experiences
