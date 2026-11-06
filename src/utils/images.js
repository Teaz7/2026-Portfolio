/*
  Loads every image under src/assets/images and converts it to WebP at build time.
  Pixel art (the game jam PNGs) is converted losslessly so it stays sharp.

  Usage:
    getImages('projects/aibrecare')  -> [{ src, name }] sorted by file name (1, 2, ... 10)
    getImage('profile/personal-picture.jpg') -> src
*/

// Glob patterns must be written out literally (Vite reads them at build time)
const lossy = import.meta.glob(
  [
    '../assets/images/**/*.{png,jpg,jpeg}',
    '!../assets/images/experiences/{project-panay,baconawa-and-eggs}/*.png',
  ],
  { eager: true, import: 'default', query: { format: 'webp', quality: '80' } },
)

const lossless = import.meta.glob('../assets/images/experiences/{project-panay,baconawa-and-eggs}/*.png', {
  eager: true,
  import: 'default',
  query: { format: 'webp', lossless: 'true' },
})

const ROOT = '../assets/images/'

const allImages = Object.entries({ ...lossy, ...lossless }).map(([path, src]) => ({
  path: path.slice(ROOT.length),
  name: path.split('/').pop().replace(/\.\w+$/, ''),
  src,
}))

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })

export function getImages(folder) {
  const prefix = `${folder.replace(/\/$/, '')}/`
  return allImages
    .filter((image) => image.path.startsWith(prefix))
    .sort(byName)
    .map(({ src, name }) => ({ src, name }))
}

export function getImage(path) {
  const image = allImages.find((item) => item.path === path)
  if (!image) throw new Error(`Image not found: ${path}`)
  return image.src
}

// Puts one image first, e.g. the poster in a featured grid: moveToFront(images, 'poster')
export function moveToFront(images, name) {
  const first = images.find((image) => image.name === name)
  return first ? [first, ...images.filter((image) => image !== first)] : images
}

// Splits a list into groups, e.g. phone screens into carousel slides of 4
export function chunk(items, size) {
  const groups = []
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size))
  return groups
}
