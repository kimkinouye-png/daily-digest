import { NextResponse } from 'next/server'
import { publishDigest } from '@/lib/store'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const published = await publishDigest(params.id)
  if (!published) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true, id: published.id, publishedAt: published.publishedAt })
}
