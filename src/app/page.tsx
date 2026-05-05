import Link from 'next/link'
import { getLatestPublished, listPublished } from '@/lib/store'
import DigestView from '@/components/digest-view'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const digest = await getLatestPublished()

  if (!digest) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <main style={{ maxWidth: 480, textAlign: 'center' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(var(--text-base), 0.3)', textTransform: 'uppercase', marginBottom: 24 }}>
            Daily Digest
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 400, marginBottom: 16 }}>
            No edition yet
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(var(--text-base), 0.5)', fontWeight: 300, lineHeight: 1.7 }}>
            The first edition will be published soon.
          </p>
        </main>
      </div>
    )
  }

  const allPublished = await listPublished()
  const pastEditions = allPublished.filter((d) => d.id !== digest.id).slice(0, 7)
  const hasMore = allPublished.length - 1 > 7

  return (
    <div style={{ minHeight: '100vh' }}>
      <DigestView digest={digest} />

      {pastEditions.length > 0 && (
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
      )}

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
    </div>
  )
}
