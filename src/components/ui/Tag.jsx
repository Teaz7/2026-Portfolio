import './Tag.css'

// Purple outline label: skills on Home, year/category tags on project titles
function Tag({ size = 'md', children }) {
  return <span className={`tag tag--${size}`}>{children}</span>
}

export default Tag
