'use client'

import type { StoredDigest } from '@/lib/store'
import type { Lens } from '@/lib/lenses'
import { LENS_COLORS, LENS_SHORT_LABELS } from '@/lib/lens-colors'
import ThemeToggle from '@/components/theme-toggle'
import Link from 'next/link'

const LENS_LABELS: Record<Lens, string> = {
  design: 'Design',
  ethics: 'Ethics',
  product: 'Product',
}

const getTagChipStyle = (lens: Lens): React.CSSProperties => ({
  display: 'inline-block',
  padding: '2px 6px',
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.6rem',
  fontWeight: 500,
  letterSpacing: '0.12em',
  color: 'rgba(var(--text-base), 0.7)',
  border: `0.5px solid ${LENS_COLORS[lens]}`,
  borderRadius: 3,
  textTransform: 'uppercase',
})

interface Props {
  digest: StoredDigest
  showHeroPersonality?: boolean
}

export default function DigestView({ digest, showHeroPersonality = true }: Props) {
  let counter = 0
  const sectionsWithAnchors = digest.sections.map((section) => ({
    ...section,
    stories: section.stories.map((s) => ({ ...s, anchor: `story-${++counter}` })),
  }))
  const flatStories = sectionsWithAnchors.flatMap((s) => s.stories)

  const usedLenses = new Set<Lens>()
  flatStories.forEach((s) => s.tags?.forEach((t) => usedLenses.add(t)))
  const VALID_LENSES_ORDERED: Lens[] = ['design', 'ethics', 'product']
  const legendLenses = VALID_LENSES_ORDERED.filter((l) => usedLenses.has(l))

  return (
    <div>
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--header-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '0.5px solid rgba(var(--border-base), 0.07)',
        padding: '14px 20px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(var(--text-base), 0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Eyes on the Chaos
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'rgba(var(--text-base), 0.55)', letterSpacing: '0.04em', textAlign: 'right' }}>
              {digest.date}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 32px) 96px' }}>
        <section style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
          {showHeroPersonality && (
            <>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)',
                color: 'rgb(var(--text-base))',
                margin: '0 0 18px',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}>
                (⌐■_■)
              </p>
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
                fontWeight: 400,
                color: 'rgb(var(--text-base))',
                margin: '0 0 14px',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}>
                Eyes on the Chaos
              </p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                fontWeight: 300,
                color: 'rgba(var(--text-base), 0.65)',
                margin: '0 0 40px',
                lineHeight: 1.6,
                maxWidth: 520,
              }}>
                The day in AI, design, product, and ethics. For people who'd rather not read 16 RSS feeds.
              </p>
            </>
          )}
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.16em', color: 'rgba(var(--text-base), 0.65)', textTransform: 'uppercase', marginBottom: 10 }}>
            {showHeroPersonality ? "Today's edition" : 'Archived edition'}
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.9rem, 6vw, 3rem)',
            fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em',
            margin: '0 0 12px',
          }}>
            {digest.date}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: 'rgba(var(--text-base), 0.65)', fontWeight: 300, margin: 0 }}>
            {digest.storyCount} stories curated from{' '}
            <Link href="/sources" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'rgba(var(--text-base), 0.3)', textUnderlineOffset: 3 }}>
              16 sources
            </Link>
          </p>
        </section>

        <section style={{
          marginBottom: 'clamp(48px, 8vw, 72px)',
          padding: 'clamp(20px, 4vw, 28px)',
          borderRadius: 10,
          background: 'var(--bg-elevated-low)',
          border: '0.5px solid rgba(var(--text-base), 0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em',
              color: 'rgba(var(--text-base), 0.55)', textTransform: 'uppercase',
              margin: 0,
            }}>
              In today's issue
            </h2>
            {legendLenses.length > 0 && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', color: 'rgba(var(--text-base), 0.55)', textTransform: 'uppercase' }}>
                {legendLenses.map((l) => (
                  <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: LENS_COLORS[l], display: 'inline-block', border: '0.5px solid rgba(var(--text-base), 0.18)' }} />
                    {LENS_SHORT_LABELS[l]}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {flatStories.map((story, i) => (
              <li key={story.anchor} style={{ marginBottom: i === flatStories.length - 1 ? 0 : 16 }}>
                <a href={`#${story.anchor}`} style={{ display: 'block', textDecoration: 'none', color: 'rgb(var(--text-base))' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(var(--text-base), 0.55)', flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '1 1 auto', minWidth: 0 }}>
                        {story.title}
                      </span>
                      {story.tags && story.tags.length > 0 && (
                        <span style={{ display: 'inline-flex', flexWrap: 'nowrap', gap: 4, flexShrink: 0 }}>
                          {story.tags.map((t) => (
                            <span key={t} title={LENS_LABELS[t]} style={{ width: 7, height: 7, borderRadius: '50%', background: LENS_COLORS[t], display: 'inline-block', border: '0.5px solid rgba(var(--text-base), 0.18)' }} />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  {story.tldr && (
                    <p style={{ fontSize: '0.9rem', color: 'rgba(var(--text-base), 0.5)', fontWeight: 300, lineHeight: 1.5, margin: '4px 0 0 32px' }}>
                      {story.tldr}
                    </p>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </section>

        {sectionsWithAnchors.map((section) => (
          <section key={section.category} style={{ marginBottom: 'clamp(48px, 8vw, 72px)' }}>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em',
              color: 'rgba(var(--text-base), 0.55)', textTransform: 'uppercase',
              margin: '0 0 28px', paddingBottom: 12,
              borderBottom: '0.5px solid rgba(var(--border-base), 0.07)',
            }}>
              {section.label}
            </h2>
            {section.stories.map((story, idx) => (
              <article id={story.anchor} key={story.anchor} style={{
                paddingBottom: idx < section.stories.length - 1 ? 'clamp(36px, 6vw, 56px)' : 0,
                marginBottom: idx < section.stories.length - 1 ? 'clamp(36px, 6vw, 56px)' : 0,
                borderBottom: idx < section.stories.length - 1 ? '0.5px solid rgba(var(--text-base), 0.07)' : 'none',
                scrollMarginTop: 80,
              }}>
                <a href={story.link} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)',
                  fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.01em',
                  color: 'rgb(var(--text-base))', textDecoration: 'none',
                  display: 'inline-block', marginBottom: 8,
                }}>
                  {story.title}
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 18px', flexWrap: 'wrap' }}>
                  <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.65rem',
                    color: 'rgba(var(--text-base), 0.65)',
                    letterSpacing: '0.06em',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}>
                    {story.source}
                  </p>
                  {story.tags && story.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {story.tags.map((t) => (
                        <span key={t} style={getTagChipStyle(t)}>{LENS_LABELS[t]}</span>
                      ))}
                    </div>
                  )}
                </div>
                {story.tldr && (
                  <p style={{
                    fontSize: 'clamp(0.95rem, 2.4vw, 1.05rem)',
                    color: 'rgba(var(--text-base), 0.78)',
                    fontWeight: 300, lineHeight: 1.65,
                    margin: '0 0 22px',
                  }}>
                    {story.tldr}
                  </p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {story.bullets.map((bullet, bi) => (
                    <li key={bi} style={{ marginBottom: 14, fontSize: '1rem', color: 'rgba(var(--text-base), 0.65)', fontWeight: 300, lineHeight: 1.7 }}>
                      <strong style={{ fontWeight: 600, color: 'rgb(var(--text-base))' }}>
                        {bullet.label}:
                      </strong>{' '}
                      {bullet.text}
                    </li>
                  ))}
                </ul>
                {story.implication && (
                  <div style={{
                    marginTop: 24,
                    paddingTop: 18,
                    paddingLeft: 16,
                    borderTop: '0.5px solid rgba(var(--text-base), 0.08)',
                    borderLeft: `2px solid ${LENS_COLORS[story.implication.lens]}`,
                  }}>
                    <p style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6rem',
                      letterSpacing: '0.14em',
                      color: LENS_COLORS[story.implication.lens],
                      textTransform: 'uppercase',
                      margin: '0 0 8px',
                    }}>
                      For {LENS_LABELS[story.implication.lens].toLowerCase()}
                    </p>
                    <p style={{
                      fontSize: '0.92rem',
                      color: 'rgba(var(--text-base), 0.75)',
                      fontWeight: 300,
                      lineHeight: 1.65,
                      margin: 0,
                      fontStyle: 'italic',
                    }}>
                      {story.implication.text}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </section>
        ))}
      </main>
    </div>
  )
}
