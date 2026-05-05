import { NextResponse } from 'next/server'
import { generateDraft } from '@/lib/generate'

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
    const result = await generateDraft()
    if (result.kind === 'skipped') {
      return NextResponse.json({ status: 'skipped', reason: result.reason })
    }
    return NextResponse.json({
      status: 'draft_created',
      id: result.stored.id,
      date: result.stored.date,
      storyCount: result.stored.storyCount,
      adminUrl: `/admin/${result.stored.id}`,
    })
  } catch (err: any) {
    console.error('[Digest] Error:', err)
    return NextResponse.json({ error: err.message || 'Digest failed' }, { status: 500 })
  }
}
