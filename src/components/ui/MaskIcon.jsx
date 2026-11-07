import './MaskIcon.css'

/*
  Shows a single-color SVG (social / tool icons) in the current text color,
  so the same file can be purple on Home and white on the dark sections.
*/
function MaskIcon({ src, label, size = '2.5rem', className = '' }) {
  return (
    <span
      className={`mask-icon ${className}`.trim()}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ '--icon-src': `url("${src}")`, '--icon-size': size }}
    />
  )
}

export default MaskIcon
