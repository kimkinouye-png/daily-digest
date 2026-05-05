'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeletePublishedButton({ id, dateLabel }: { id: string; dateLabel: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const click = async () => {
    if (!confirm(`Delete the published edition for ${dateLabel}? This cannot be undone.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/digest/${id}/delete`, { method: 'POST' })
      if (!res.ok) {
        alert('Delete failed')
        setBusy(false)
        return
      }
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Delete failed')
      setBusy(false)
    }
  }

  return (
    <button
      onClick={click}
      disabled={busy}
      style={{
        background: 'none',
        border: '0.5px solid rgba(231,76,60,0.4)',
        color: 'rgba(231,76,60,0.85)',
        padding: '4px 10px',
        borderRadius: 4,
        fontSize: '0.7rem',
        fontFamily: "'DM Sans', sans-serif",
        cursor: busy ? 'not-allowed' : 'pointer',
        opacity: busy ? 0.5 : 1,
        flexShrink: 0,
      }}
    >
      {busy ? 'Deleting...' : 'Delete'}
    </button>
  )
}
