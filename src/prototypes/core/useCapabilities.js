import { useState } from 'react'
import { detectCapabilities } from './capabilities'

export function useCapabilities() {
  const [caps] = useState(detectCapabilities)
  return caps
}
