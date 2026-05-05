import type { Lens } from './lenses'

export const LENS_COLORS: Record<Lens, string> = {
  design: '#d8a373',
  ethics: '#c97a7a',
  engineering: '#7a9bc9',
  product: '#88b89c',
  leadership: '#d4b06e',
  accessibility: '#a98ec4',
}

export const LENS_SHORT_LABELS: Record<Lens, string> = {
  design: 'Design',
  ethics: 'Ethics',
  engineering: 'Eng',
  product: 'Product',
  leadership: 'Lead',
  accessibility: 'A11y',
}
