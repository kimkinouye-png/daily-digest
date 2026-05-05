import Link from 'next/link'
import { getLatestPublished, listPublished } from '@/lib/store'
import DigestView from '@/components/digest-view'
import ThemeToggle from '@/components/theme-toggle'

export const dynamic = 'force-dynamic'

const heroPersonality = (
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
)

const pastEditionsBlock = (pastEditions: Awaited<ReturnType<typeof listPublished>>, hasMore: boolean) => (
  pastEditions.length > 0 ? (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 clamp(20px, 5vw, 32px) 32px' }}>
      <h2 style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em',
        color: 'rgba(var(--text-base), 0.55)', textTransform: 'uppercase',
        margin: '0 0 18px', paddingBottom: 12,
        borderTop: '0.5px solid rgba(var(--border-base), 0.07)',
        paddingTop: 32,
      }}>
        Past editions
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {pastEditions.map((d) => (
          <li key={d.id} style={{ marginBottom: 10 }}>
            <Link href={`/archive/${d.id}`} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 12,
              textDecoration: 'none',
              color: 'rgb(var(--text-base))',
              padding: '6px 0',
            }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 400 }}>{d.date}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(var(--text-base), 0.55)', flexShrink: 0 }}>
                {d.storyCount} stories
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div style={{ marginTop: 16 }}>
          <Link href="/archive" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            color: 'rgba(var(--text-base), 0.65)',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(var(--text-base), 0.3)',
            textUnderlineOffset: 3,
          }}>
            View all editions →
          </Link>
        </div>
      )}
    </section>
  ) : null
)

const footer = (
  <footer style={{
    maxWidth: 720,
    margin: '0 auto',
    padding: '24px clamp(20px, 5vw, 32px) 96px',
    textAlign: 'center',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(var(--text-base), 0.3)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  }}>
    End of edition
  </footer>
)

export default async function Home() {
  const digest = await getLatestPublished()
  const allPublished = await listPublished()

  // Empty state — no published edition yet
  if (!digest) {
    const pastEditions = allPublished.slice(0, 7)
    const hasMore = allPublished.length > 7

    return (
      <div style={{ minHeight: '100vh' }}>
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
            <ThemeToggle />
          </div>
        </header>

        <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 32px) 64px' }}>
          <section style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
            {heroPersonality}
          </section>

          <section style={{
            padding: 'clamp(28px, 5vw, 40px) clamp(20px, 4vw, 28px)',
            borderRadius: 10,
            background: 'var(--bg-elevated-low)',
            border: '0.5px solid rgba(var(--text-base), 0.06)',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.16em',
              color: 'rgba(var(--text-base), 0.55)',
              textTransform: 'uppercase',
              margin: '0 0 14px',
            }}>
              Today's edition
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              margin: '0 0 12px',
            }}>
              On its way.
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: 'rgba(var(--text-base), 0.55)',
              fontWeight: 300,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 420,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Today's edition hasn't shipped yet. Check back soon{pastEditions.length > 0 ? ', or browse past editions below' : ''}.
            </p>
          </section>
        </main>

        {pastEditionsBlock(pastEditions, hasMore)}
        {footer}
      </div>
    )
  }

  // Populated state — has a current published edition
  const pastEditions = allPublished.filter((d) => d.id !== digest.id).slice(0, 7)
  const hasMore = allPublished.length - 1 > 7

  return (
    <div style={{ minHeight: '100vh' }}>
      <DigestView digest={digest} />
      {pastEditionsBlock(pastEditions, hasMore)}
      {footer}
    </div>
  )
}
