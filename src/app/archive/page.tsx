import Link from 'next/link'
import { listPublished } from '@/lib/store'
import ThemeToggle from '@/components/theme-toggle'

export const dynamic = 'force-dynamic'

export default async function ArchivePage() {
  const editions = await listPublished()

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
            ← Daily Digest
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 32px) 96px' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.16em', color: 'rgba(var(--text-base), 0.65)', textTransform: 'uppercase', marginBottom: 14 }}>
          Archive
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem, 6vw, 3rem)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
          Past editions
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(var(--text-base), 0.65)', fontWeight: 300, margin: '0 0 48px' }}>
          {editions.length === 0 ? 'No editions yet.' : `${editions.length} edition${editions.length === 1 ? '' : 's'}, most recent first.`}
        </p>

        {editions.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {editions.map((d) => (
              <li key={d.id} style={{
                marginBottom: 12,
                borderBottom: '0.5px solid rgba(var(--text-base), 0.07)',
                paddingBottom: 12,
              }}>
                <Link href={`/archive/${d.id}`} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 12,
                  textDecoration: 'none',
                  color: 'rgb(var(--text-base))',
                  padding: '6px 0',
                }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>{d.date}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(var(--text-base), 0.55)', flexShrink: 0 }}>
                    {d.storyCount} stories
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
