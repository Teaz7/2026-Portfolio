import './Tag.css'

// Outline label: skills on Home, year/category tags on project titles.
// tone: 'purple' on white backgrounds, 'light' (white) on dark ones
function Tag({ size = 'md', tone = 'purple', children }) {
  return <span className={`tag tag--${size} tag--${tone}`}>{children}</span>
}

export default Tag
