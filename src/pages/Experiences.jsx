import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Tag from '../components/ui/Tag.jsx'
import Chip from '../components/ui/Chip.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import Typewriter from '../components/ui/Typewriter.jsx'
import { useDealOffsets, useIntroSlideUp, usePageEntrance } from '../hooks/usePageEntrance.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { useStickyFit } from '../hooks/useCover.js'
import { stagger } from '../utils/intro.js'
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

/*
  Animations (same patterns as Projects):
  - Header: title types, jump chips deal out from behind each other
  - Entries: title types, tags (or category/event) slide in, purple intro wipes in,
    bullet diamonds turn and their text slides in, sidebar items slide in
  - Gallery bands cover the screen and stay pinned briefly (like Home); once
    covered, the photos rise in one after another (reset when scrolling back up)
  - Awards slide in row by row; certificate groups type their title, then rise in
*/
const HEADER_TITLE = 'Experiences ’23–’26'
const HEADER_TYPING = { delay: 100, speed: 45 }
const CHIPS_START = HEADER_TYPING.delay + HEADER_TITLE.length * HEADER_TYPING.speed + 100
const CHIP_STEP = 110

const TITLE_SPEED = 40
const HEAD_STEP = 100
const BULLET_STEP = 170
const SIDE_STEP = 150

function entryTimeline(title) {
  const head = title.length * TITLE_SPEED + 50
  const intro = head + 150
  const bullets = intro + 450
  return { head, intro, bullets, side: bullets + 100 }
}

const at = (ms) => ({ animationDelay: `${ms}ms` })

const fileName = (path) => path.split('/').pop().replace(/\.\w+$/, '').replaceAll('-', ' ')

// Image items (src + alt) for a list of image paths. Game screenshots are pixel art.
const toItems = (paths, label, { pixelated = false } = {}) =>
  paths.map((path) => ({
    src: getImage(path),
    alt: `${label}: ${fileName(path)}`,
    pixelated: pixelated && path.endsWith('.png'),
  }))

// `order`: position in a gallery band's rise (see .exp-band--play in the CSS)
function Tile({ item, className = '', order }) {
  return (
    <div
      className={`exp-tile ${className}`.trim()}
      style={order === undefined ? undefined : { '--i': order }}
    >
      <img src={item.src} alt={item.alt} className={item.pixelated ? 'is-pixelated' : undefined} />
    </div>
  )
}

function Bullets({ items, start }) {
  return (
    <ul className="exp-bullets">
      {items.map((bullet, index) => (
        <li key={bullet} style={{ '--bullet-delay': `${start + stagger(index, BULLET_STEP)}ms` }}>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  )
}

function SideList({ items, className = '', start }) {
  return (
    <dl className={`exp-side ${className}`.trim()}>
      {items.map(({ label, values, small }, index) => (
        <div key={label} className="exp-side__item" style={at(start + stagger(index, SIDE_STEP))}>
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

/*
  Entry layout + animation: text on top (stays in place), then a dark gallery band
  that slides over it, covers the screen and stays pinned while the photos rise in.
  `head` renders what follows the title ({ at, start, tagsRef }); `band` the gallery.
*/
function Entry({ variant, titleId, title, head, intro, bullets, side, sideClassName, band }) {
  const { ref: mainRef, phase, run, wait } = useScrollReveal({ playAt: 0.75, resetAt: 1 })
  const time = entryTimeline(title)
  const after = (ms) => wait + ms
  const tagsRef = useDealOffsets()

  const stageRef = useRef(null)
  useStickyFit(mainRef)
  useStickyFit(stageRef)
  const {
    ref: trackRef,
    phase: bandPhase,
    wait: bandWait,
  } = useScrollReveal({ playAt: 0.05, resetAt: 0.7 })
  useIntroSlideUp(trackRef) // on smaller screens, waits below until the sweep is gone

  return (
    <section
      className={`exp-entry exp-entry--${variant} exp-entry--${phase}`}
      aria-labelledby={titleId}
    >
      <Container ref={mainRef} className="exp-entry__main">
        <div className="exp-entry__content">
          <div className={`exp-head${variant === 'game' ? ' exp-head--game' : ''}`}>
            <h3 id={titleId} className="exp-head__title">
              <Typewriter
                key={run}
                text={title}
                play={phase !== 'done'}
                active={phase === 'play'}
                delay={wait}
                speed={TITLE_SPEED}
              />
            </h3>
            {head({ at: (ms) => at(after(time.head + ms)), tagsRef })}
          </div>
          <p className="exp-intro" style={at(after(time.intro))}>
            {intro}
          </p>
          <Bullets items={bullets} start={after(time.bullets)} />
        </div>
        <SideList items={side} className={sideClassName} start={after(time.side)} />
      </Container>

      <div
        ref={trackRef}
        className={`exp-band exp-band--${bandPhase}`}
        style={{ '--band-wait': `${bandWait}ms` }}
      >
        <div ref={stageRef} className="exp-stage">
          {band}
        </div>
      </div>
    </section>
  )
}

// Tags dealing out after the title, like the header chips
function HeadTags({ tags, at: delay, tagsRef }) {
  return (
    <ul ref={tagsRef} className="tag-list exp-head__tags">
      {tags.map((tag, index) => (
        <li key={tag} style={delay(stagger(index, 90))}>
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  )
}

// Game jam entry: poster on the left, 2×3 grid of screenshots on the right
function CompetitionEntry({ entry }) {
  const items = toItems([entry.poster, ...entry.images], entry.award, { pixelated: true })
  const [poster, ...grid] = items
  const headLines = [entry.category, entry.event].filter(Boolean)

  return (
    <Entry
      variant="game"
      titleId={`${entry.id}-title`}
      title={entry.award}
      head={({ at: delay }) =>
        headLines.map((line, index) => (
          <p
            key={line}
            className={index === headLines.length - 1 ? 'exp-head__event' : 'exp-head__category'}
            style={delay(index * HEAD_STEP)}
          >
            {line}
          </p>
        ))
      }
      intro={<RichText parts={entry.intro} />}
      bullets={entry.bullets}
      side={entry.side}
      band={
        <div className="exp-gallery-poster">
          <Tile item={poster} order={0} className="exp-gallery-poster__poster" />
          <div className="exp-gallery-poster__grid">
            {grid.map((item, index) => (
              <Tile key={item.src} item={item} order={index + 1} />
            ))}
          </div>
        </div>
      }
    />
  )
}

// Award rows slide in from the left one after another; the notes from the right
function AwardsSection() {
  const { ref, phase, wait } = useScrollReveal({ playAt: 0.8, resetAt: 1 })

  return (
    <Container ref={ref} className={`exp-awards exp-awards--${phase}`}>
      <dl className="exp-awards__list">
        {awards.map(({ name, year }, index) => (
          <div
            key={`${name}-${index}`}
            className="exp-awards__row"
            style={at(wait + stagger(index, 120))}
          >
            <dt>{name}</dt>
            <dd>{year}</dd>
          </div>
        ))}
      </dl>

      <div className="exp-awards__side">
        <div className="exp-awards__note" style={at(wait + 250)}>
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
        {awardNotes.map(({ label, text }, index) => (
          <div key={label} className="exp-awards__note" style={at(wait + 250 + (index + 1) * 150)}>
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
    <Entry
      variant="link"
      titleId="link-exe-title"
      title={linkExe.name}
      head={({ at: delay, tagsRef }) => (
        <HeadTags tags={linkExe.tags} at={delay} tagsRef={tagsRef} />
      )}
      intro={linkExe.intro}
      bullets={linkExe.bullets}
      side={linkExe.side}
      sideClassName="exp-side--wide"
      band={
        <figure className="exp-gallery-link">
          <div className="exp-gallery-link__photos">
            <div className="exp-gallery-link__tall">
              {tall.map((item, index) => (
                <Tile key={item.src} item={item} order={index} />
              ))}
            </div>
            <div className="exp-gallery-link__grid">
              {grid.map((item, index) => (
                <Tile key={item.src} item={item} order={tall.length + index} />
              ))}
            </div>
          </div>
          <figcaption style={{ '--i': items.length }}>{linkExe.credit}</figcaption>
        </figure>
      }
    />
  )
}

function WebinarEntry() {
  const items = toItems(webinarCoHost.images, webinarCoHost.name)

  return (
    <Entry
      variant="webinar"
      titleId="webinar-title"
      title={webinarCoHost.name}
      head={({ at: delay, tagsRef }) => (
        <HeadTags tags={webinarCoHost.tags} at={delay} tagsRef={tagsRef} />
      )}
      intro={webinarCoHost.intro}
      bullets={webinarCoHost.bullets}
      side={webinarCoHost.side}
      band={
        <div className="exp-gallery-webinar">
          {items.map((item, index) => (
            <Tile key={item.src} item={item} order={index} />
          ))}
        </div>
      }
    />
  )
}

function CertificateGroup({ group }) {
  const items = group.items.map(({ caption, label, image }) => ({
    src: getImage(image),
    alt: `${group.title}: ${caption ?? label}`,
    caption,
  }))

  // Title types, then the certificates rise in one after another
  const { ref, phase, run, wait } = useScrollReveal({ playAt: 0.85, resetAt: 1 })
  const certsStart = wait + group.title.length * 30 + 100

  return (
    <section ref={ref} className={`exp-certs exp-certs--${phase}`} aria-label={group.title}>
      <Container>
        <h3 className="exp-certs__title">
          <Typewriter
            key={run}
            text={group.title}
            play={phase !== 'done'}
            active={phase === 'play'}
            delay={wait}
            speed={30}
          />
        </h3>
      </Container>
      <ul className={`exp-certs__grid exp-certs__grid--${group.size}`}>
        {items.map((item, index) => (
          <li key={item.src} style={at(certsStart + stagger(index, 80))}>
            {item.caption && <p className="exp-certs__caption">{item.caption}</p>}
            <Tile item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}

const HEADER_DURATION = CHIPS_START + stagger(jumpLinks.length - 1, CHIP_STEP) + 300

function Experiences() {
  const start = usePageEntrance(HEADER_DURATION)
  const chipsRef = useDealOffsets()

  return (
    <div className="experiences-page">
      <Container
        as="header"
        className={`exp-header${start === null ? '' : ' page-entrance'}`}
      >
        <h1 className="exp-header__title">
          <Typewriter
            text={HEADER_TITLE}
            play={start !== null}
            delay={(start ?? 0) + HEADER_TYPING.delay}
            speed={HEADER_TYPING.speed}
          />
        </h1>
        <nav aria-label="Jump to section">
          <ul ref={chipsRef} className="chip-list">
            {jumpLinks.map(({ id, label }, index) => (
              <li key={id} style={at((start ?? 0) + CHIPS_START + stagger(index, CHIP_STEP))}>
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
