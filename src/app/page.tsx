export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <main style={{ maxWidth: 480, textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(240,237,230,0.3)', textTransform: 'uppercase', marginBottom: '24px' }}>
          Daily Digest
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Building something new
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(240,237,230,0.5)', fontWeight: 300, lineHeight: 1.7 }}>
          The published-digest view is being rebuilt. Check back soon.
        </p>
      </main>
    </div>
  )
}
