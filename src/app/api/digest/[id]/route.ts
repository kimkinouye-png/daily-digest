import { NextResponse } from 'next/server'
import { updateDigest, getDigest } from '@/lib/store'
import { CATEGORY_LABELS, type FeedSource } from '@/lib/feeds'
import type { DigestStory } from '@/lib/summarize'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const digest = await getDigest(params.id)
  if (!digest) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(digest)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const stories: DigestStory[] = body.stories || []
  const date: string | undefined = body.date

  const categoryOrder: FeedSource['category'][] = ['ai', 'product-ux', 'business-strategy']
  const sections = categoryOrder
    .map((cat) => ({
      label: CATEGORY_LABELS[cat],
      category: cat,
      stories: stories.filter((s) => s.category === cat),
    }))
    .filter((s) => s.stories.length > 0)

  const patch: any = { sections, storyCount: stories.length }
  if (date) patch.date = date

  const updated = await updateDigest(params.id, patch)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}
