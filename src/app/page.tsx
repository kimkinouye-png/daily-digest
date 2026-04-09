export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.7rem',
        letterSpacing: '0.18em',
        color: 'rgba(240,237,230,0.4)',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}>
        Daily Digest
      </p>
      <h1 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        marginBottom: '1rem',
        maxWidth: '480px',
      }}>
        Your daily AI &amp; product briefing
      </h1>
      <p style={{
        fontSize: '1rem',
        color: 'rgba(240,237,230,0.55)',
        fontWeight: 300,
        lineHeight: 1.7,
        maxWidth: '420px',
        marginBottom: '2rem',
      }}>
        8-12 curated stories from 16 sources, grouped by topic, posted to Slack every morning at 7 AM CT.
      </p>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.75rem',
        color: 'rgba(240,237,230,0.25)',
      }}>
        Running on Vercel cron + Claude
      </p>
    </div>
  )
}
