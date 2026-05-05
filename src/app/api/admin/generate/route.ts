import { NextResponse } from 'next/server'
import { generateDraft } from '@/lib/generate'

export const maxDuration = 60

export async function POST() {
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
    })
  } catch (err: any) {
    console.error('[Admin/Generate] Error:', err)
    return NextResponse.json({ error: err.message || 'Generate failed' }, { status: 500 })
  }
}
