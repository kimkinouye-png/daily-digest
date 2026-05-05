import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eyes on the Chaos',
  description: "A daily digest of AI, design, product, and ethics. For people who'd rather not read 16 RSS feeds.",
}

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch(e) {}
})();
`

const themeStyles = `
:root {
  --bg-page: #0e0e0e;
  --bg-elevated-low: rgba(240,237,230,0.025);
  --bg-elevated-high: rgba(240,237,230,0.04);
  --text-base: 240, 237, 230;
  --border-base: 255, 255, 255;
  --header-bg: rgba(14,14,14,0.92);
  --accent: #f0ede6;
  --accent-fg: #0e0e0e;
}
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --bg-page: #faf8f3;
    --bg-elevated-low: rgba(42,40,38,0.035);
    --bg-elevated-high: rgba(42,40,38,0.06);
    --text-base: 20, 20, 22;
    --border-base: 0, 0, 0;
    --header-bg: rgba(250,248,243,0.92);
    --accent: #2a2826;
    --accent-fg: #faf8f3;
  }
}
:root[data-theme="light"] {
  --bg-page: #faf8f3;
  --bg-elevated-low: rgba(42,40,38,0.035);
  --bg-elevated-high: rgba(42,40,38,0.06);
  --text-base: 20, 20, 22;
  --border-base: 0, 0, 0;
  --header-bg: rgba(250,248,243,0.92);
  --accent: #2a2826;
  --accent-fg: #faf8f3;
}
:root[data-theme="dark"] {
  --bg-page: #0e0e0e;
  --bg-elevated-low: rgba(240,237,230,0.025);
  --bg-elevated-high: rgba(240,237,230,0.04);
  --text-base: 240, 237, 230;
  --border-base: 255, 255, 255;
  --header-bg: rgba(14,14,14,0.92);
  --accent: #f0ede6;
  --accent-fg: #0e0e0e;
}
html { scroll-behavior: smooth; }
body { -webkit-font-smoothing: antialiased; background: var(--bg-page); color: rgb(var(--text-base)); }
`

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
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body style={{ margin: 0, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
