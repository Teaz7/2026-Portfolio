import { useEffect, useState } from 'react'
import './Typewriter.css'

/*
  Types `text` out one character at a time (`speed` ms per character), starting
  `delay` ms after `active` turns true. With `play` false the text just shows.
  The untyped part stays in the layout (invisible), so nothing shifts while typing.
  Screen readers get the full text straight away.
*/
function Typewriter({ text, delay = 0, speed = 40, play = true, active = true }) {
  const [count, setCount] = useState(play ? -1 : text.length) // -1 = not started

  useEffect(() => {
    if (!play || !active) return
    const start = performance.now() + delay
    let frame
    const tick = (now) => {
      const elapsed = now - start
      const next = elapsed < 0 ? -1 : Math.min(text.length, Math.floor(elapsed / speed) + 1)
      setCount(next)
      if (next < text.length) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [play, active, text, delay, speed])

  const typed = Math.max(count, 0)
  const typing = count >= 0 && count < text.length

  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, typed)}
        {typing && <span className="typewriter__caret" />}
        <span className="typewriter__rest">{text.slice(typed)}</span>
      </span>
    </>
  )
}

export default Typewriter
