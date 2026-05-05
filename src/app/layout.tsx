import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Digest',
  description: 'AI-curated daily digest of AI, product, and strategy news',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "'DM Sans', system-ui, sans-serif", background: '#0e0e0e', color: '#f0ede6' }}>
        {children}
      </body>
    </html>
  )
}
