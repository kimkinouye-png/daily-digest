'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { StoredDigest } from '@/lib/store'
import type { DigestStory, DigestBullet, Lens } from '@/lib/summarize'
import { VALID_LENSES } from '@/lib/summarize'
import type { FeedSource } from '@/lib/feeds'

const CATEGORIES: { value: FeedSource['category']; label: string }[] = [
  { value: 'ai', label: 'AI Research & News' },
  { value: 'product-ux', label: 'Product & UX' },
  { value: 'business-strategy', label: 'Business & Strategy' },
]

const LENS_LABELS: Record<Lens, string> = {
  design: 'Design',
  ethics: 'Ethics',
  engineering: 'Engineering',
  product: 'Product',
  leadership: 'Leadership',
  accessibility: 'Accessibility',
}

function flatten(d: StoredDigest): DigestStory[] {
  return d.sections.flatMap((s) => s.stories)
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 4,
  border: '0.5px solid rgba(240,237,230,0.15)',
  background: 'rgba(240,237,230,0.03)',
  color: '#f0ede6',
  fontSize: '0.9rem',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.65rem',
  letterSpacing: '0.1em',
  color: 'rgba(240,237,230,0.4)',
  textTransform: 'uppercase',
  marginBottom: 6,
}

export default function EditorClient({ digest }: { digest: StoredDigest }) {
  const router = useRouter()
  const [stories, setStories] = useState<DigestStory[]>(flatten(digest))
  const [date, setDate] = useState(digest.date)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const updateStory = (i: number, patch: Partial<DigestStory>) => {
    setStories((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }
  const updateBullet = (storyIdx: number, bulletIdx: number, patch: Partial<DigestBullet>) => {
    setStories((prev) =>
      prev.map((s, idx) =>
        idx === storyIdx
          ? { ...s, bullets: s.bullets.map((b, bi) => (bi === bulletIdx ? { ...b, ...patch } : b)) }
          : s,
      ),
    )
  }
  const addBullet = (storyIdx: number) => {
    setStories((prev) =>
      prev.map((s, idx) =>
        idx === storyIdx ? { ...s, bullets: [...s.bullets, { label: '', text: '' }] } : s,
      ),
    )
  }
  const removeBullet = (storyIdx: number, bulletIdx: number) => {
    setStories((prev) =>
      prev.map((s, idx) =>
        idx === storyIdx ? { ...s, bullets: s.bullets.filter((_, bi) => bi !== bulletIdx) } : s,
      ),
    )
  }
  const removeStory = (i: number) => {
    if (!confirm('Remove this story from the digest?')) return
    setStories((prev) => prev.filter((_, idx) => idx !== i))
  }

  const toggleTag = (storyIdx: number, lens: Lens) => {
    setStories((prev) =>
      prev.map((s, idx) => {
        if (idx !== storyIdx) return s
        const current = s.tags || []
        const has = current.includes(lens)
        const next = has ? current.filter((t) => t !== lens) : [...current, lens]
        return { ...s, tags: next.length > 0 ? next : undefined }
      }),
    )
  }

  const updateImplicationText = (storyIdx: number, text: string) => {
    setStories((prev) =>
      prev.map((s, idx) => {
        if (idx !== storyIdx) return s
        if (!text.trim()) return { ...s, implication: undefined }
        const lens = s.implication?.lens || (s.tags && s.tags[0]) || 'design'
        return { ...s, implication: { lens, text } }
      }),
    )
  }

  const updateImplicationLens = (storyIdx: number, lens: Lens) => {
    setStories((prev) =>
      prev.map((s, idx) => {
        if (idx !== storyIdx) return s
        if (!s.implication) return s
        return { ...s, implication: { ...s.implication, lens } }
      }),
    )
  }

  const save = async () => {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/digest/${digest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stories, date }),
      })
      if (!res.ok) throw new Error('Save failed')
      setMsg('Saved')
      setTimeout(() => setMsg(null), 2000)
    } catch (err: any) {
      setMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    if (!confirm('Publish this digest? It will become the latest published edition.')) return
    setPublishing(true)
    setMsg(null)
    try {
      await fetch(`/api/digest/${digest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stories, date }),
      })
      const res = await fetch(`/api/digest/${digest.id}/publish`, { method: 'POST' })
      if (!res.ok) throw new Error('Publish failed')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setMsg(err.message)
      setPublishing(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'rgba(240,237,230,0.5)', textDecoration: 'none' }}>
            ← Drafts
          </Link>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {msg && <span style={{ fontSize: '0.8rem', color: 'rgba(240,237,230,0.55)' }}>{msg}</span>}
            <button
              onClick={save}
              disabled={saving || publishing}
              style={{
                padding: '8px 16px', borderRadius: 6, border: '0.5px solid rgba(240,237,230,0.2)',
                background: 'transparent', color: '#f0ede6',
                fontSize: '0.8rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {saving ? 'Saving...' : 'Save draft'}
            </button>
            <button
              onClick={publish}
              disabled={saving || publishing}
              style={{
                padding: '8px 16px', borderRadius: 6, border: 'none',
                background: '#f0ede6', color: '#0e0e0e',
                fontSize: '0.8rem', fontWeight: 500, cursor: publishing ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </header>

        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle}>Date heading</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </div>

        <p style={{ fontSize: '0.85rem', color: 'rgba(240,237,230,0.45)', marginBottom: 32 }}>
          {stories.length} stor{stories.length === 1 ? 'y' : 'ies'}
        </p>

        {stories.map((story, i) => (
          <article
            key={i}
            style={{ marginBottom: 28, padding: 20, borderRadius: 8, border: '0.5px solid rgba(240,237,230,0.08)', background: 'rgba(240,237,230,0.015)' }}
          >
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Title</label>
              <input value={story.title} onChange={(e) => updateStory(i, { title: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Source</label>
                <input value={story.source} onChange={(e) => updateStory(i, { source: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={story.category}
                  onChange={(e) => updateStory(i, { category: e.target.value as FeedSource['category'] })}
                  style={inputStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} style={{ background: '#0e0e0e' }}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Link</label>
              <input value={story.link} onChange={(e) => updateStory(i, { link: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>TLDR (one short sentence — appears in top preview)</label>
              <textarea
                value={story.tldr}
                onChange={(e) => updateStory(i, { tldr: e.target.value })}
                rows={2}
                style={{ ...inputStyle, fontFamily: "'DM Sans', sans-serif", resize: 'vertical' }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Bullets</label>
              {story.bullets.map((b, bi) => (
                <div key={bi} style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
                  <input
                    value={b.label}
                    onChange={(e) => updateBullet(i, bi, { label: e.target.value })}
                    placeholder="Label"
                    style={{ ...inputStyle, fontWeight: 600 }}
                  />
                  <textarea
                    value={b.text}
                    onChange={(e) => updateBullet(i, bi, { text: e.target.value })}
                    placeholder="1-2 sentences"
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                  <button
                    onClick={() => removeBullet(i, bi)}
                    style={{ padding: '6px 10px', borderRadius: 4, border: '0.5px solid rgba(240,237,230,0.15)', background: 'transparent', color: 'rgba(240,237,230,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}
                    title="Remove bullet"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => addBullet(i)}
                style={{ marginTop: 4, padding: '6px 12px', borderRadius: 4, border: '0.5px dashed rgba(240,237,230,0.2)', background: 'transparent', color: 'rgba(240,237,230,0.6)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                + Add bullet
              </button>
            </div>

            {/* Tags + implication */}
            <div style={{ marginTop: 14, padding: 14, borderRadius: 6, border: '0.5px dashed rgba(240,237,230,0.12)', background: 'rgba(240,237,230,0.01)' }}>
              <label style={labelStyle}>Lens tags (which roles is this relevant to?)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {VALID_LENSES.map((lens) => {
                  const active = story.tags?.includes(lens)
                  return (
                    <button
                      key={lens}
                      onClick={() => toggleTag(i, lens)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 4,
                        border: '0.5px solid ' + (active ? 'rgba(240,237,230,0.5)' : 'rgba(240,237,230,0.15)'),
                        background: active ? 'rgba(240,237,230,0.08)' : 'transparent',
                        color: active ? '#f0ede6' : 'rgba(240,237,230,0.55)',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.7rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {LENS_LABELS[lens]}
                    </button>
                  )
                })}
              </div>

              <label style={labelStyle}>Implication (optional — leave blank if nothing concrete to add)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 8, alignItems: 'start' }}>
                <select
                  value={story.implication?.lens || (story.tags && story.tags[0]) || 'design'}
                  onChange={(e) => updateImplicationLens(i, e.target.value as Lens)}
                  disabled={!story.implication}
                  style={{ ...inputStyle, width: 'auto', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', padding: '8px 10px' }}
                >
                  {VALID_LENSES.map((lens) => (
                    <option key={lens} value={lens} style={{ background: '#0e0e0e' }}>
                      For {LENS_LABELS[lens].toLowerCase()}
                    </option>
                  ))}
                </select>
                <textarea
                  value={story.implication?.text || ''}
                  onChange={(e) => updateImplicationText(i, e.target.value)}
                  placeholder="What this means for the lens above. Leave empty to omit entirely."
                  rows={2}
                  style={{ ...inputStyle, fontFamily: "'DM Sans', sans-serif", resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '0.5px solid rgba(240,237,230,0.06)', textAlign: 'right' }}>
              <button
                onClick={() => removeStory(i)}
                style={{ background: 'none', border: 'none', color: 'rgba(231,76,60,0.7)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                Remove story
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
