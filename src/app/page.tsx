'use client'

import { useState } from 'react'

export default function Home() {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const runDigest = async () => {
    setGenerating(true)
    setResult(null)
    try {
      const res = await fetch('/api/digest?manual=true')
      const data = await res.json()
      if (data.id) {
        setResult(`Draft saved: ${data.id} (${data.storyCount} stories). Visit /admin/${data.id} once admin UI is built.`)
      } else if (data.error) {
        setResult(`Error: ${data.error}`)
      } else {
        setResult(JSON.stringify(data))
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e0e', color: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <main style={{ maxWidth: 480, textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(240,237,230,0.3)', textTransform: 'uppercase', marginBottom: '24px' }}>
          Daily Digest
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Building something new
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(240,237,230,0.5)', fontWeight: 300, lineHeight: 1.7, marginBottom: '32px' }}>
          The published-digest view is being rebuilt. In the meantime, you can still generate drafts.
        </p>
        <button
          onClick={runDigest}
          disabled={generating}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 500,
            color: generating ? 'rgba(240,237,230,0.3)' : '#0e0e0e',
            background: generating ? 'rgba(240,237,230,0.08)' : '#f0ede6',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 24px',
            cursor: generating ? 'not-allowed' : 'pointer',
          }}
        >
          {generating ? 'Generating draft...' : 'Generate Draft'}
        </button>
        {result && (
          <p style={{ marginTop: '32px', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'rgba(240,237,230,0.5)', lineHeight: 1.6 }}>
            {result}
          </p>
        )}
      </main>
    </div>
  )
}
