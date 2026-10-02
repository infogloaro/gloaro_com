// Every external 3D model / texture / image used in a prototype must be listed here
// with its license verified for commercial use before launch.
export const assetRegister = [
  // Client-supplied films. Both carry a generator watermark (bottom-right sparkle), hidden by a 1.32× centre crop.
  { id: 'food/burger-stack.mp4', prototype: 'food/default', source: 'client-supplied', license: 'to confirm', commercialUseVerified: false, attribution: '' },
  { id: 'food/pizza-cut.mp4', prototype: 'food/default', source: 'client-supplied', license: 'to confirm', commercialUseVerified: false, attribution: '' },
  // Stills (burger-full, burger-layers, burger-poster, pizza-oven, pizza-close, pizza-slices) are frames cropped from the two films.
  // { id: 'food-table.glb', prototype: 'food/default', source: 'url or "custom-blender"',
  //   license: 'CC0 | CC-BY | purchased | custom', commercialUseVerified: false, attribution: '' },
]
