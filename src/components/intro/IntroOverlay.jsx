import { useState } from 'react'
import { INTRO_ENABLED } from '../../utils/intro.js'
import './IntroOverlay.css'

// Purple panel that sweeps in from the right, holds, then slides away to the left
function IntroOverlay() {
  const [visible, setVisible] = useState(INTRO_ENABLED)
  if (!visible) return null
  return <div className="intro-overlay" aria-hidden="true" onAnimationEnd={() => setVisible(false)} />
}

export default IntroOverlay
