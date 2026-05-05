import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { deleteDigest } from '@/lib/store'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteDigest(params.id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/archive')
  revalidatePath(`/archive/${params.id}`)

  return NextResponse.json({ ok: true })
}
