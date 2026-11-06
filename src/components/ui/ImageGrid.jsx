import { useState } from 'react'
import Lightbox from './Lightbox.jsx'
import './ImageGrid.css'

/*
  Grid of thumbnails that open in a lightbox.
  items:    [{ src, alt, caption?, pixelated? }]
  columns:  number of equal columns, or `template` for a custom grid-template-columns
  ratio:    thumbnail aspect ratio, e.g. '4 / 3'
  featured: first item spans `featuredRows` rows (e.g. a game poster next to a 2x3 grid);
            put the poster first with moveToFront() from utils/images.js
  zoom:     thumbnails grow on hover instead of lifting (certificates)
*/
function ImageGrid({
  items,
  columns = 3,
  template,
  ratio = '4 / 3',
  featured = false,
  featuredRows = 3,
  zoom = false,
  className = '',
}) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <ul
        className={`image-grid${zoom ? ' image-grid--zoom' : ''} ${className}`.trim()}
        style={{
          '--grid-template': template ?? `repeat(${columns}, minmax(0, 1fr))`,
          '--grid-ratio': ratio,
          '--featured-rows': featuredRows,
        }}
      >
        {items.map((item, index) => (
          <li
            key={item.src}
            className={`image-grid__item${featured && index === 0 ? ' image-grid__item--featured' : ''}`}
          >
            {item.caption && <p className="image-grid__caption">{item.caption}</p>}
            <button className="image-grid__thumb" onClick={() => setOpenIndex(index)}>
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className={item.pixelated ? 'is-pixelated' : undefined}
              />
            </button>
          </li>
        ))}
      </ul>

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

export default ImageGrid
