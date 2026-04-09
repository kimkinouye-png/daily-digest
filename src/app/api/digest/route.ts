import { NextResponse } from 'next/server'
import { fetchAllFeeds } from '@/lib/rss'
import { buildDigest } from '@/lib/summarize'
import { postToSlack } from '@/lib/slack'

export const maxDuration = 60 // allow up to 60s for RSS + Claude + Slack

export async function GET(request: Request) {
  // Verify cron secret if present (Vercel cron sends this header)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Allow manual triggers without secret in dev, but block unauthorized cron calls
    const url = new URL(request.url)
    const isManual = url.searchParams.get('manual') === 'true'
    const triggerKey = url.searchParams.get('key')
    const manualKey = process.env.MANUAL_TRIGGER_KEY

    if (!isManual || !manualKey || triggerKey !== manualKey) {
      if (cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
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
    console.log(`[Digest] Digest ready: ${digest.storyCount} stories in ${digest.sections.length} sections`)

    console.log('[Digest] Posting to Slack...')
    await postToSlack(digest)
    console.log('[Digest] Posted successfully')

    return NextResponse.json({
      status: 'posted',
      date: digest.date,
      storyCount: digest.storyCount,
      sections: digest.sections.map((s) => `${s.label} (${s.stories.length})`),
    })
  } catch (err: any) {
    console.error('[Digest] Error:', err)
    return NextResponse.json(
      { error: err.message || 'Digest failed' },
      { status: 500 }
    )
  }
}
