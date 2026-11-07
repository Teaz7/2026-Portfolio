import './Container.css'

// Keeps content inside the 80px page margins
function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`container ${className}`.trim()} {...props}>
      {children}
    </Tag>
  )
}

export default Container
