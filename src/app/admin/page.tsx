import Link from 'next/link'
import { listDrafts, listPublished } from '@/lib/store'
import GenerateButton from './generate-button'
import LogoutButton from './logout-button'
import DeletePublishedButton from './delete-published-button'
import ThemeToggle from '@/components/theme-toggle'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const drafts = await listDrafts()
  const published = await listPublished()

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, gap: 12, flexWrap: 'wrap' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(var(--text-base), 0.55)', textTransform: 'uppercase', margin: 0 }}>
            Admin
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.8rem',
                color: 'rgba(var(--text-base), 0.7)',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 6,
                border: '0.5px solid rgba(var(--text-base), 0.15)',
              }}
            >
              View site →
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', fontWeight: 400, marginBottom: 8 }}>
          Drafts
        </h1>
        <p style={{ color: 'rgba(var(--text-base), 0.55)', fontSize: '0.95rem', fontWeight: 300, marginBottom: 32 }}>
          {drafts.length === 0 ? 'No drafts yet.' : `${drafts.length} draft${drafts.length === 1 ? '' : 's'} waiting to be published.`}
        </p>

        <div style={{ marginBottom: 48 }}>
          <GenerateButton />
        </div>

        {drafts.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 64 }}>
            {drafts.map((d) => (
              <li key={d.id} style={{ marginBottom: 12 }}>
                <Link
                  href={`/admin/${d.id}`}
                  style={{
                    display: 'block',
                    padding: '16px 20px',
                    borderRadius: 8,
                    border: '0.5px solid rgba(var(--text-base), 0.1)',
                    background: 'rgba(var(--text-base), 0.02)',
                    color: 'rgb(var(--text-base))',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: 4 }}>{d.date}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(var(--text-base), 0.55)' }}>
                    {d.storyCount} stories · created {new Date(d.createdAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div style={{ paddingTop: 32, borderTop: '0.5px solid rgba(var(--text-base), 0.1)' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', fontWeight: 400, marginBottom: 8 }}>
            Published editions
          </h2>
          <p style={{ color: 'rgba(var(--text-base), 0.55)', fontSize: '0.9rem', fontWeight: 300, marginBottom: 24 }}>
            {published.length === 0 ? 'Nothing published yet.' : `${published.length} edition${published.length === 1 ? '' : 's'} live, most recent first.`}
          </p>

          {published.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {published.map((d) => (
                <li
                  key={d.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '12px 16px',
                    marginBottom: 8,
                    borderRadius: 6,
                    border: '0.5px solid rgba(var(--text-base), 0.08)',
                    background: 'rgba(var(--text-base), 0.015)',
                  }}
                >
                  <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                    <Link
                      href={`/archive/${d.id}`}
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'rgb(var(--text-base))',
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      {d.date}
                    </Link>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'rgba(var(--text-base), 0.5)', marginTop: 2 }}>
                      {d.storyCount} stories · published {d.publishedAt ? new Date(d.publishedAt).toLocaleDateString('en-US', { timeZone: 'America/Chicago' }) : 'unknown'}
                    </div>
                  </div>
                  <DeletePublishedButton id={d.id} dateLabel={d.date} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
