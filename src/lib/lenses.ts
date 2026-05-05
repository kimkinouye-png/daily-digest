// Pure types and constants — no module-level side effects, safe to import
// from client components without dragging the Anthropic SDK into the browser
// bundle.

import type { FeedSource } from './feeds'

export const VALID_LENSES = ['design', 'ethics', 'product'] as const
export type Lens = typeof VALID_LENSES[number]

export interface DigestBullet {
  label: string
  text: string
}

export interface DigestImplication {
  lens: Lens
  text: string
}

export interface DigestStory {
  title: string
  source: string
  link: string
  category: FeedSource['category']
  tldr: string
  bullets: DigestBullet[]
  tags?: Lens[]
  implication?: DigestImplication
}
