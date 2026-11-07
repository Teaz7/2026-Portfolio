import './Chip.css'

// Dark outline jump link at the top of Projects / Experiences, e.g. href="#aibrecare"
function Chip({ href, children }) {
  return (
    <a href={href} className="chip">
      {children}
    </a>
  )
}

export default Chip
