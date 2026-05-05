'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('theme')) as 'light' | 'dark' | null
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved)
    } else if (typeof window !== 'undefined') {
      setTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    }
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem('theme', next) } catch {}
    document.documentElement.setAttribute('data-theme', next)
  }

  if (!theme) return <span style={{ width: 28, height: 28, display: 'inline-block' }} aria-hidden />

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: '0.5px solid rgba(var(--border-base), 0.15)',
        borderRadius: 6,
        color: 'rgba(var(--text-base), 0.6)',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {theme === 'dark' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
