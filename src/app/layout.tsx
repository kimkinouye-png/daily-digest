import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Digest',
  description: 'AI-curated daily digest of AI, product, and strategy news',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'DM Sans', system-ui, sans-serif", background: '#0e0e0e', color: '#f0ede6' }}>
        {children}
      </body>
    </html>
  )
}
