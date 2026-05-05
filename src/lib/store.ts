import { Redis } from '@upstash/redis'
import type { Digest } from './summarize'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const PREFIX = 'digest:'
const KEY_ITEM = (id: string) => `${PREFIX}item:${id}`
const KEY_DRAFTS = `${PREFIX}drafts`
const KEY_LATEST_PUBLISHED = `${PREFIX}latest:published`

export interface StoredDigest extends Digest {
  id: string
  status: 'draft' | 'published'
  createdAt: string
  publishedAt: string | null
}

async function generateId(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10)
  const exists = await redis.exists(KEY_ITEM(today))
  if (!exists) return today
  let n = 2
  while (await redis.exists(KEY_ITEM(`${today}-${n}`))) n++
  return `${today}-${n}`
}

export async function saveDraft(digest: Digest): Promise<StoredDigest> {
  const id = await generateId()
  const stored: StoredDigest = {
    ...digest,
    id,
    status: 'draft',
    createdAt: new Date().toISOString(),
    publishedAt: null,
  }
  await redis.set(KEY_ITEM(id), stored)
  await redis.lpush(KEY_DRAFTS, id)
  return stored
}

export async function getDigest(id: string): Promise<StoredDigest | null> {
  const item = await redis.get<StoredDigest>(KEY_ITEM(id))
  return item ?? null
}

export async function listDrafts(): Promise<StoredDigest[]> {
  const ids = await redis.lrange(KEY_DRAFTS, 0, -1)
  if (ids.length === 0) return []
  const items = await Promise.all(ids.map((id) => redis.get<StoredDigest>(KEY_ITEM(id))))
  return items.filter((x): x is StoredDigest => x !== null && x.status === 'draft')
}

export async function updateDigest(id: string, patch: Partial<Digest>): Promise<StoredDigest | null> {
  const existing = await getDigest(id)
  if (!existing) return null
  const updated: StoredDigest = { ...existing, ...patch, id: existing.id, status: existing.status, createdAt: existing.createdAt }
  await redis.set(KEY_ITEM(id), updated)
  return updated
}

export async function publishDigest(id: string): Promise<StoredDigest | null> {
  const existing = await getDigest(id)
  if (!existing) return null
  const published: StoredDigest = { ...existing, status: 'published', publishedAt: new Date().toISOString() }
  await redis.set(KEY_ITEM(id), published)
  await redis.lrem(KEY_DRAFTS, 0, id)
  await redis.set(KEY_LATEST_PUBLISHED, id)
  return published
}

export async function getLatestPublished(): Promise<StoredDigest | null> {
  const id = await redis.get<string>(KEY_LATEST_PUBLISHED)
  if (!id) return null
  return redis.get<StoredDigest>(KEY_ITEM(id))
}
