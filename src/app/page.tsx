'use client'

import { useState } from 'react'

interface DigestStory {
  title: string
  source: string
  link: string
  summary: string
  category: string
}

interface DigestSection {
  label: string
  category: string
  stories: DigestStory[]
}

interface DigestResult {
  status: string
  date: string
  storyCount: number
  sections: DigestSection[]
}

export default function Home() {
  const [digest, setDigest] = useState<DigestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDigest = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/digest?manual=true')
      if (!res.ok) throw new Error('Digest failed')
      const data = await res.json()
      setDigest(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e0e', color: '#f0ede6' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(14,14,14,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.8rem',
          color: 'rgba(240,237,230,0.5)',
          letterSpacing: '0.08em',
        }}>
          Daily Digest
        </span>
        <button
          onClick={runDigest}
          disabled={loading}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 500,
            color: loading ? 'rgba(240,237,230,0.3)' : '#0e0e0e',
            background: loading ? 'rgba(240,237,230,0.08)' : '#f0ede6',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Scanning feeds...' : digest ? 'Refresh' : 'Run Digest'}
        </button>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        {/* Empty state */}
        {!digest && !loading && !error && (
          <div style={{ textAlign: 'center', paddingTop: '120px' }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              color: 'rgba(240,237,230,0.3)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              Daily Digest
            </p>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>
              Your daily AI &amp; product briefing
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(240,237,230,0.5)',
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: 420,
              margin: '0 auto 32px',
            }}>
              8-12 curated stories from 16 sources, grouped by topic. Hit "Run Digest" to generate today's edition.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', paddingTop: '120px' }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8rem',
              color: 'rgba(240,237,230,0.4)',
              letterSpacing: '0.06em',
            }}>
              Fetching 16 RSS feeds...
            </p>
            <p style={{
              fontSize: '0.85rem',
              color: 'rgba(240,237,230,0.25)',
              fontWeight: 300,
              marginTop: '8px',
            }}>
              Claude is reading and curating. This takes about 30 seconds.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            textAlign: 'center',
            paddingTop: '120px',
            color: '#e74c3c',
          }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
              {error}
            </p>
            <button
              onClick={runDigest}
              style={{
                marginTop: '16px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                color: '#f0ede6',
                background: 'none',
                border: '0.5px solid rgba(240,237,230,0.2)',
                borderRadius: '6px',
                padding: '8px 20px',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Digest results */}
        {digest && !loading && (
          <div>
            <div style={{ marginBottom: '40px' }}>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                color: 'rgba(240,237,230,0.35)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {digest.date}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(240,237,230,0.45)',
                fontWeight: 300,
              }}>
                {digest.storyCount} stories curated from 16 sources
              </p>
            </div>

            {digest.sections.map((section) => (
              <div key={section.category} style={{ marginBottom: '48px' }}>
                <h2 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,237,230,0.5)',
                  borderBottom: '0.5px solid rgba(255,255,255,0.07)',
                  paddingBottom: '12px',
                  marginBottom: '24px',
                }}>
                  {section.label}
                </h2>

                {section.stories.map((story, i) => (
                  <article key={i} style={{
                    marginBottom: '28px',
                    paddingBottom: '28px',
                    borderBottom: i < section.stories.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <a
                      href={story.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '1.05rem',
                        fontWeight: 500,
                        color: '#f0ede6',
                        textDecoration: 'none',
                        lineHeight: 1.4,
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      {story.title}
                    </a>
                    <p style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.7rem',
                      color: 'rgba(240,237,230,0.3)',
                      marginBottom: '10px',
                      letterSpacing: '0.04em',
                    }}>
                      {story.source}
                    </p>
                    <p style={{
                      fontSize: '0.92rem',
                      color: 'rgba(240,237,230,0.65)',
                      fontWeight: 300,
                      lineHeight: 1.75,
                    }}>
                      {story.summary}
                    </p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
