// Decides how much 3D a device gets: 'full' | 'lite' | 'static'.
export function detectCapabilities() {
  if (typeof window === 'undefined') {
    return { tier: 'static', webgl2: false, webgpu: false, reducedMotion: true, dpr: 1 }
  }

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  let webgl2
  try {
    webgl2 = !!document.createElement('canvas').getContext('webgl2')
  } catch {
    webgl2 = false
  }
  const webgpu = 'gpu' in navigator

  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const saveData = navigator.connection?.saveData === true
  const isMobile = window.matchMedia?.('(pointer: coarse) and (max-width: 900px)').matches ?? false
  const lowEnd = cores <= 4 || memory <= 2 || saveData

  let tier = 'full'
  if (!webgl2 || reducedMotion) tier = 'static'
  else if (isMobile || lowEnd) tier = 'lite'

  const maxDpr = tier === 'full' ? 2 : tier === 'lite' ? 1.25 : 1
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)

  return { tier, webgl2, webgpu, reducedMotion, isMobile, dpr }
}
