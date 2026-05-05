'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const click = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }
  return (
    <button
      onClick={click}
      style={{
        background: 'none',
        border: '0.5px solid rgba(240,237,230,0.15)',
        color: 'rgba(240,237,230,0.7)',
        padding: '6px 14px',
        borderRadius: 6,
        fontSize: '0.8rem',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
      }}
    >
      Sign out
    </button>
  )
}
