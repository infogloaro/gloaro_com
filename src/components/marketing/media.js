// Every file under ./media/<industry>/ becomes a hashed URL at build time.
// Industry data refers to media by path ('vrmc/logo.jpg'); a path with no file
// yet resolves to null and the scene renders a labelled placeholder instead,
// so new images can be dropped in without touching code.
const files = import.meta.glob('./media/*/*.{jpg,jpeg,png,webp,avif,mp4,webm}', { eager: true, import: 'default' })

export function mediaUrl(path) {
  if (!path) return null
  return files[`./media/${path}`] ?? null
}
