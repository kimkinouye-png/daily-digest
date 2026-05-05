import { fetchAllFeeds } from './rss'
import { buildDigest } from './summarize'
import { saveDraft, type StoredDigest } from './store'

export type GenerateResult =
  | { kind: 'created'; stored: StoredDigest }
  | { kind: 'skipped'; reason: string }

export async function generateDraft(): Promise<GenerateResult> {
  console.log('[Generate] Fetching RSS feeds...')
  const items = await fetchAllFeeds()
  console.log(`[Generate] Got ${items.length} items from feeds`)
  if (items.length === 0) {
    return { kind: 'skipped', reason: 'No recent articles found' }
  }
  console.log('[Generate] Building digest with Claude...')
  const digest = await buildDigest(items)
  console.log(`[Generate] Built ${digest.storyCount} stories`)
  console.log('[Generate] Saving as draft...')
  const stored = await saveDraft(digest)
  console.log(`[Generate] Draft saved as ${stored.id}`)
  return { kind: 'created', stored }
}
