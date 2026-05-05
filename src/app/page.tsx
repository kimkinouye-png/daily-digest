import { getLatestPublished } from '@/lib/store'
import type { Lens } from '@/lib/summarize'

export const dynamic = 'force-dynamic'

const LENS_LABELS: Record<Lens, string> = {
  design: 'Design',
  ethics: 'Ethics',
  engineering: 'Engineering',
  product: 'Product',
  leadership: 'Leadership',
  accessibility: 'Accessibility',
}

const tagChipStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 6px',
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.6rem',
  fontWeight: 500,
  letterSpacing: '0.12em',
  color: 'rgba(240,237,230,0.7)',
  border: '0.5px solid rgba(240,237,230,0.25)',
  borderRadius: 3,
  textTransform: 'uppercase',
}

export default async function Home() {
  const digest = await getLatestPublished()

  if (!digest) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <main style={{ maxWidth: 480, textAlign: 'center' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(240,237,230,0.3)', textTransform: 'uppercase', marginBottom: 24 }}>
            Daily Digest
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 400, marginBottom: 16 }}>
            No edition yet
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(240,237,230,0.5)', fontWeight: 300, lineHeight: 1.7 }}>
            The first edition will be published soon.
          </p>
        </main>
      </div>
    )
  }

  let counter = 0
  const sectionsWithAnchors = digest.sections.map((section) => ({
    ...section,
    stories: section.stories.map((s) => ({ ...s, anchor: `story-${++counter}` })),
  }))
  const flatStories = sectionsWithAnchors.flatMap((s) => s.stories)

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(14,14,14,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        padding: '14px 20px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(240,237,230,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Daily Digest
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'rgba(240,237,230,0.35)', letterSpacing: '0.04em', textAlign: 'right' }}>
            {digest.date}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 32px) 96px' }}>
        <section style={{ marginBottom: 'clamp(40px, 7vw, 64px)' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.16em', color: 'rgba(240,237,230,0.35)', textTransform: 'uppercase', marginBottom: 14 }}>
            Today's edition
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.9rem, 6vw, 3rem)',
            fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em',
            margin: '0 0 12px',
          }}>
            {digest.date}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', color: 'rgba(240,237,230,0.5)', fontWeight: 300, margin: 0 }}>
            {digest.storyCount} stories curated from 16 sources
          </p>
        </section>

        <section style={{
          marginBottom: 'clamp(48px, 8vw, 72px)',
          padding: 'clamp(20px, 4vw, 28px)',
          borderRadius: 10,
          background: 'rgba(240,237,230,0.025)',
          border: '0.5px solid rgba(240,237,230,0.06)',
        }}>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em',
            color: 'rgba(240,237,230,0.55)', textTransform: 'uppercase',
            margin: '0 0 18px',
          }}>
            In today's issue
          </h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {flatStories.map((story, i) => (
              <li key={story.anchor} style={{ marginBottom: i === flatStories.length - 1 ? 0 : 16 }}>
                <a
                  href={`#${story.anchor}`}
                  style={{ display: 'block', textDecoration: 'none', color: '#f0ede6' }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(240,237,230,0.4)', flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4, flex: '1 1 auto' }}>
                      {story.title}
                      {story.tags && story.tags.length > 0 && (
                        <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, marginLeft: 8, verticalAlign: '2px' }}>
                          {story.tags.map((t) => (
                            <span key={t} style={tagChipStyle}>{LENS_LABELS[t]}</span>
                          ))}
                        </span>
                      )}
                    </span>
                  </div>
                  {story.tldr && (
                    <p style={{ fontSize: '0.85rem', color: 'rgba(240,237,230,0.5)', fontWeight: 300, lineHeight: 1.5, margin: '4px 0 0 32px' }}>
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
              color: 'rgba(240,237,230,0.55)', textTransform: 'uppercase',
              margin: '0 0 28px', paddingBottom: 12,
              borderBottom: '0.5px solid rgba(255,255,255,0.07)',
            }}>
              {section.label}
            </h2>
            {section.stories.map((story, idx) => (
              <article
                id={story.anchor}
                key={story.anchor}
                style={{
                  paddingBottom: idx < section.stories.length - 1 ? 'clamp(36px, 6vw, 56px)' : 0,
                  marginBottom: idx < section.stories.length - 1 ? 'clamp(36px, 6vw, 56px)' : 0,
                  borderBottom: idx < section.stories.length - 1 ? '0.5px solid rgba(240,237,230,0.07)' : 'none',
                  scrollMarginTop: 80,
                }}
              >
                <a
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)',
                    fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.01em',
                    color: '#f0ede6', textDecoration: 'none',
                    display: 'inline-block', marginBottom: 8,
                  }}
                >
                  {story.title}
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 18px', flexWrap: 'wrap' }}>
                  <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.65rem',
                    color: 'rgba(240,237,230,0.4)',
                    letterSpacing: '0.06em',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}>
                    {story.source}
                  </p>
                  {story.tags && story.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {story.tags.map((t) => (
                        <span key={t} style={tagChipStyle}>{LENS_LABELS[t]}</span>
                      ))}
                    </div>
                  )}
                </div>
                {story.tldr && (
                  <p style={{
                    fontSize: 'clamp(0.95rem, 2.4vw, 1.05rem)',
                    color: 'rgba(240,237,230,0.78)',
                    fontWeight: 300, lineHeight: 1.65,
                    margin: '0 0 22px',
                  }}>
                    {story.tldr}
                  </p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {story.bullets.map((bullet, bi) => (
                    <li
                      key={bi}
                      style={{
                        marginBottom: 14,
                        fontSize: '0.95rem',
                        color: 'rgba(240,237,230,0.65)',
                        fontWeight: 300,
                        lineHeight: 1.7,
                      }}
                    >
                      <strong style={{ fontWeight: 600, color: '#f0ede6' }}>
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
                    borderTop: '0.5px solid rgba(240,237,230,0.08)',
                    borderLeft: '2px solid rgba(240,237,230,0.25)',
                  }}>
                    <p style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6rem',
                      letterSpacing: '0.14em',
                      color: 'rgba(240,237,230,0.5)',
                      textTransform: 'uppercase',
                      margin: '0 0 8px',
                    }}>
                      For {LENS_LABELS[story.implication.lens].toLowerCase()}
                    </p>
                    <p style={{
                      fontSize: '0.92rem',
                      color: 'rgba(240,237,230,0.75)',
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

        <footer style={{
          marginTop: 'clamp(48px, 8vw, 80px)',
          paddingTop: 24,
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(240,237,230,0.3)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          End of edition
        </footer>
      </main>
    </div>
  )
}
