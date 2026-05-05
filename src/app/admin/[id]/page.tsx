import { notFound } from 'next/navigation'
import { getDigest } from '@/lib/store'
import EditorClient from './editor-client'

export const dynamic = 'force-dynamic'

export default async function EditorPage({ params }: { params: { id: string } }) {
  const digest = await getDigest(params.id)
  if (!digest) notFound()
  return <EditorClient digest={digest} />
}
