// Shared smooth-scroll settings (Layout's Lenis setup, back-to-top button)
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Ease in-out for jumps (anchor links like #contact, project chips, back to top)
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Ease out for things you click (back to top): moves right away, settles gently
export const easeOutQuart = (t) => 1 - (1 - t) ** 4
