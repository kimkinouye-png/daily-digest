import Link from 'next/link'
import { listDrafts, getLatestPublished } from '@/lib/store'
import GenerateButton from './generate-button'
import LogoutButton from './logout-button'
import ThemeToggle from '@/components/theme-toggle'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const drafts = await listDrafts()
  const latest = await getLatestPublished()

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(var(--text-base), 0.4)', textTransform: 'uppercase' }}>
            Admin
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', fontWeight: 400, marginBottom: 8 }}>
          Drafts
        </h1>
        <p style={{ color: 'rgba(var(--text-base), 0.5)', fontSize: '0.95rem', fontWeight: 300, marginBottom: 32 }}>
          {drafts.length === 0 ? 'No drafts yet.' : `${drafts.length} draft${drafts.length === 1 ? '' : 's'} waiting to be published.`}
        </p>

        <div style={{ marginBottom: 48 }}>
          <GenerateButton />
        </div>

        {drafts.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'rgba(var(--text-base), 0.4)' }}>
                    {d.storyCount} stories · created {new Date(d.createdAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {latest && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '0.5px solid rgba(var(--text-base), 0.08)' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(var(--text-base), 0.4)', textTransform: 'uppercase', marginBottom: 12 }}>
              Latest published
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(var(--text-base), 0.65)' }}>
              {latest.date} · {latest.storyCount} stories
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
