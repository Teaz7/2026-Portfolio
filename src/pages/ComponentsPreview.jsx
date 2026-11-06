import { ArrowRight, Download } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Tag from '../components/ui/Tag.jsx'
import Chip from '../components/ui/Chip.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import MaskIcon from '../components/ui/MaskIcon.jsx'
import Carousel from '../components/ui/Carousel.jsx'
import ImageGrid from '../components/ui/ImageGrid.jsx'
import { chunk, getImages, moveToFront } from '../utils/images.js'
import githubIcon from '../assets/icons/github.svg'
import linkedinIcon from '../assets/icons/linkedin.svg'
import facebookIcon from '../assets/icons/facebook.svg'
import './ComponentsPreview.css'

// Dev-only page (localhost:5173/components) for checking shared components in isolation

const colors = [
  ['Purple', '--color-purple'],
  ['Dark', '--color-dark'],
  ['White', '--color-white'],
  ['Tibiao', '--color-tibiao'],
  ['AiBreCare', '--color-aibrecare'],
  ['CozyTask', '--color-cozytask'],
  ['LagawTa', '--color-lagawta'],
  ['AgriLinko', '--color-agrilinko'],
]

const socialIcons = [
  [linkedinIcon, 'LinkedIn'],
  [githubIcon, 'GitHub'],
  [facebookIcon, 'Facebook'],
]

const toGridItems = (images, label, pixelated = false) =>
  images.map((image) => ({ src: image.src, alt: `${label}: ${image.name}`, pixelated }))

function Group({ title, children, dark = false }) {
  return (
    <section className={`preview-group${dark ? ' preview-group--dark' : ''}`}>
      <h2 className="preview-group__title">{title}</h2>
      {children}
    </section>
  )
}

function ComponentsPreview() {
  const aibrecare = getImages('projects/aibrecare')
  const tibiao = getImages('projects/tibiao-web')

  return (
    <div className="preview">
      <Container>
        <h1 className="preview__title">Components</h1>
        <p>Dev only. This page is not included in the production build.</p>
      </Container>

      <Container>
        <Group title="Colors">
          <div className="preview-row">
            {colors.map(([name, token]) => (
              <div key={token} className="preview-swatch">
                <span style={{ background: `var(${token})` }} />
                {name}
              </div>
            ))}
          </div>
        </Group>

        <Group title="Typography">
          <p className="preview-type preview-type--display">Let’s Connect!</p>
          <p className="preview-type preview-type--h2">AiBreCare</p>
          <p className="preview-type preview-type--lg">Body large (Inter 28px)</p>
          <p className="preview-type preview-type--md">Body (Inter 24px)</p>
        </Group>

        <Group title="Buttons">
          <div className="preview-row">
            <Button icon={Download}>Download Resume</Button>
            <Button icon={ArrowRight}>View My Projects</Button>
            <Button size="sm">Contact</Button>
          </div>
          <div className="preview-row preview-row--purple" data-cursor="light">
            <Button variant="light" size="md" shape="soft">
              tjlarroza@gmail.com
            </Button>
            <Button variant="dark" size="md" shape="soft" icon={Download}>
              Download Resume
            </Button>
          </div>
        </Group>

        <Group title="Tags & Chips">
          <ul className="tag-list">
            {['AI Integration', 'Full-Stack Development', 'Flutter', 'React.js'].map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
          <ul className="tag-list">
            {['2025 – 2026', 'Mobile Application', 'Full-Stack'].map((tag) => (
              <li key={tag}>
                <Tag size="sm">{tag}</Tag>
              </li>
            ))}
          </ul>
          <div className="chip-list">
            <Chip href="#carousel">AiBreCare</Chip>
            <Chip href="#carousel">Tibiao Bakery Web</Chip>
            <Chip href="#grid">CozyTask</Chip>
          </div>
        </Group>

        <Group title="Section labels & icons">
          <SectionLabel>Developed Projects</SectionLabel>
          <div className="preview-row preview-row--icons">
            {socialIcons.map(([src, label]) => (
              <MaskIcon key={label} src={src} label={label} size="3rem" />
            ))}
          </div>
        </Group>
      </Container>

      <section id="carousel">
        <Container>
          <h2 className="preview-group__title">Carousel: phone screens (4 per slide)</h2>
        </Container>
        <Carousel
          label="AiBreCare"
          slides={chunk(aibrecare, 4)}
          width="78.625rem"
          height="37.5rem"
          accent="var(--color-aibrecare)"
        />
        <Container>
          <h2 className="preview-group__title">Carousel: web screens (1 per slide, with peek)</h2>
        </Container>
        <Carousel
          label="Tibiao Bakery Web"
          slides={chunk(tibiao, 1)}
          width="68.75rem"
          height="31.25rem"
          slideWidth="56.0625rem"
          accent="var(--color-tibiao)"
        />
      </section>

      <Container id="grid">
        <Group title="Image grid: featured poster + 2×3 (pixel art)">
          <ImageGrid
            items={toGridItems(
              moveToFront(getImages('experiences/project-panay'), 'poster'),
              'Project Panay',
              true,
            )}
            template="1.4fr repeat(2, minmax(0, 1fr))"
            featured
            ratio="16 / 9"
          />
        </Group>

        <Group title="Image grid: certificates with captions">
          <ImageGrid
            items={getImages('certificates/cisco').map((image) => ({
              src: image.src,
              alt: `Cisco certificate: ${image.name}`,
              caption: image.name.replaceAll('-', ' '),
            }))}
            columns={3}
            ratio="1.48 / 1"
            zoom
          />
        </Group>
      </Container>
    </div>
  )
}

export default ComponentsPreview
