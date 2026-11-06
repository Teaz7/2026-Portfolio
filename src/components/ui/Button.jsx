import { Link } from 'react-router-dom'
import './Button.css'

/*
  variant: 'primary' (purple) | 'dark' | 'light' (white)
  size:    'sm' (nav) | 'md' (contact section) | 'lg' (hero, View My Projects)
  shape:   'pill' | 'soft' (rounded corners)
  Renders a router Link with `to`, an <a> with `href`, otherwise a <button>.
*/
function Button({
  variant = 'primary',
  size = 'lg',
  shape = 'pill',
  icon: Icon,
  to,
  href,
  className = '',
  children,
  ...props
}) {
  const classes = `button button--${variant} button--${size} button--${shape} ${className}`.trim()
  const content = (
    <>
      <span>{children}</span>
      {Icon && <Icon className="button__icon" aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}

export default Button
