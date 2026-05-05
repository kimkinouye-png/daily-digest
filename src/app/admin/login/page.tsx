'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/admin'
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Login failed')
      }
      router.push(next)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 360 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(var(--text-base), 0.3)', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
          Admin
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', fontWeight: 400, marginBottom: 32, textAlign: 'center' }}>
          Sign in
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 6,
            border: '0.5px solid rgba(var(--text-base), 0.2)',
            background: 'rgba(var(--text-base), 0.04)',
            color: 'rgb(var(--text-base))',
            fontSize: '0.95rem',
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            marginBottom: 16,
            boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          disabled={submitting || !password}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 6,
            border: 'none',
            background: submitting || !password ? 'rgba(var(--text-base), 0.08)' : 'var(--accent)',
            color: submitting || !password ? 'rgba(var(--text-base), 0.3)' : 'var(--accent-fg)',
            fontSize: '0.9rem',
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: submitting || !password ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
        {error && (
          <p style={{ marginTop: 16, color: '#e74c3c', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>
        )}
      </form>
    </div>
  )
}
