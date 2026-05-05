import { NextResponse } from 'next/server'
import { fetchAllFeeds } from '@/lib/rss'
import { buildDigest } from '@/lib/summarize'
import { saveDraft } from '@/lib/store'

export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const url = new URL(request.url)
    const isManual = url.searchParams.get('manual') === 'true'
    const triggerKey = url.searchParams.get('key')
    const manualKey = process.env.MANUAL_TRIGGER_KEY
    if (!isManual || !manualKey || triggerKey !== manualKey) {
      if (cronSecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    console.log('[Digest] Fetching RSS feeds...')
    const items = await fetchAllFeeds()
    console.log(`[Digest] Got ${items.length} items from feeds`)
    if (items.length === 0) {
      return NextResponse.json({ status: 'skipped', reason: 'No recent articles found' })
    }
    console.log('[Digest] Building digest with Claude...')
    const digest = await buildDigest(items)
    console.log(`[Digest] Building done: ${digest.storyCount} stories`)
    console.log('[Digest] Saving as draft...')
    const stored = await saveDraft(digest)
    console.log(`[Digest] Draft saved as ${stored.id}`)
    return NextResponse.json({
      status: 'draft_created',
      id: stored.id,
      date: stored.date,
      storyCount: stored.storyCount,
      adminUrl: `/admin/${stored.id}`,
    })
  } catch (err: any) {
    console.error('[Digest] Error:', err)
    return NextResponse.json({ error: err.message || 'Digest failed' }, { status: 500 })
  }
}
