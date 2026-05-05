import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { publishDigest } from '@/lib/store'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const published = await publishDigest(params.id)
  if (!published) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  revalidatePath('/admin')
  revalidatePath(`/admin/${params.id}`)
  revalidatePath('/')

  return NextResponse.json({ ok: true, id: published.id, publishedAt: published.publishedAt })
}
