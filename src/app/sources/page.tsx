import Link from 'next/link'
import { FEEDS, CATEGORY_LABELS, type FeedSource } from '@/lib/feeds'
import ThemeToggle from '@/components/theme-toggle'

export const dynamic = 'force-static'

export default function SourcesPage() {
  const categoryOrder: FeedSource['category'][] = ['ai', 'product-ux', 'business-strategy']
  const grouped = categoryOrder.map((cat) => ({
    label: CATEGORY_LABELS[cat],
    category: cat,
    feeds: FEEDS.filter((f) => f.category === cat),
  })).filter((g) => g.feeds.length > 0)

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
            ← Eyes on the Chaos
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 32px) 96px' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.16em', color: 'rgba(var(--text-base), 0.65)', textTransform: 'uppercase', marginBottom: 14 }}>
          Sources
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem, 6vw, 3rem)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
          Where this comes from
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(var(--text-base), 0.65)', fontWeight: 300, margin: '0 0 48px', lineHeight: 1.6 }}>
          Eyes on the Chaos pulls from these {FEEDS.length} RSS feeds, then a human editor curates and writes the synthesis. Stories are grouped by category and tagged by lens.
        </p>

        {grouped.map((g) => (
          <section key={g.category} style={{ marginBottom: 'clamp(40px, 6vw, 56px)' }}>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em',
              color: 'rgba(var(--text-base), 0.55)', textTransform: 'uppercase',
              margin: '0 0 20px', paddingBottom: 12,
              borderBottom: '0.5px solid rgba(var(--border-base), 0.07)',
            }}>
              {g.label}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {g.feeds.map((f) => (
                <li key={f.url} style={{ marginBottom: 12 }}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 12,
                    textDecoration: 'none',
                    color: 'rgb(var(--text-base))',
                    padding: '4px 0',
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: 400 }}>{f.name}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'rgba(var(--text-base), 0.45)', flexShrink: 0 }}>
                      RSS →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}
