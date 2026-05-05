import type { Lens } from './lenses'

export const LENS_COLORS: Record<Lens, string> = {
  design: '#ef8a17',
  ethics: '#ef2917',
  engineering: '#034732',
  product: '#008148',
  leadership: '#c6c013',
  accessibility: '#0e7bbf',
}

export const LENS_SHORT_LABELS: Record<Lens, string> = {
  design: 'Design',
  ethics: 'Ethics',
  engineering: 'Eng',
  product: 'Product',
  leadership: 'Lead',
  accessibility: 'A11y',
}
