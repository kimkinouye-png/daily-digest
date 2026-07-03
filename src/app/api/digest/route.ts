import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { generateDraft } from '@/lib/generate'
import { publishDigest } from '@/lib/store'

export const maxDuration = 300

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
    await publishDigest(result.stored.id)
    revalidatePath('/')
    return NextResponse.json({
      status: 'published',
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
