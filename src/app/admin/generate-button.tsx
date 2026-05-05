'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GenerateButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const click = async () => {
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/generate', { method: 'POST' })
      const data = await res.json()
      if (data.id) {
        router.push(`/admin/${data.id}`)
      } else {
        setMsg(data.reason || data.error || 'Done')
      }
    } catch (err: any) {
      setMsg(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <button
        onClick={click}
        disabled={busy}
        style={{
          padding: '10px 20px',
          borderRadius: 6,
          border: 'none',
          background: busy ? 'rgba(var(--text-base), 0.08)' : 'var(--accent)',
          color: busy ? 'rgba(var(--text-base), 0.3)' : 'var(--accent-fg)',
          fontSize: '0.85rem',
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          cursor: busy ? 'not-allowed' : 'pointer',
        }}
      >
        {busy ? 'Generating draft (about 30s)...' : 'Generate new draft'}
      </button>
      {msg && <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'rgba(var(--text-base), 0.5)' }}>{msg}</p>}
    </div>
  )
}
