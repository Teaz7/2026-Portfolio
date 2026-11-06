import './SectionLabel.css'

// "◆ LABEL" heading. tone: 'dark' on white backgrounds, 'light' on dark/purple ones
function SectionLabel({ as: Tag = 'h2', tone = 'dark', children }) {
  return (
    <Tag className={`section-label section-label--${tone}`}>
      <span className="section-label__diamond" aria-hidden="true" />
      {children}
    </Tag>
  )
}

export default SectionLabel
