import cameraFilm from '../media/camera-assemble.mp4'
import cameraPoster from '../media/camera-poster.jpg'
import cameraEnd from '../media/camera-end.jpg'
import showroomFilm from '../media/showroom-tour.mp4'
import showroomPoster from '../media/showroom-poster.jpg'

// Studio renders of each product, captured from the same 3D models (transparent PNG).
const files = import.meta.glob('../media/products/*.png', { eager: true, import: 'default' })
const byName = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop().replace('.png', ''), url]))

export const imageOf = (id) => byName[id]
export const explodedImageOf = (id) => byName[`${id}-x`]

// Client-supplied films: the camera assembly (hero) and the gallery walk-through.
export const MEDIA = { cameraFilm, cameraPoster, cameraEnd, showroomFilm, showroomPoster }
