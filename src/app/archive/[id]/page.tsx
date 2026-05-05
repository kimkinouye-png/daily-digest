import { notFound } from 'next/navigation'
import { getDigest } from '@/lib/store'
import DigestView from '@/components/digest-view'

export const dynamic = 'force-dynamic'

export default async function ArchiveItem({ params }: { params: { id: string } }) {
  const digest = await getDigest(params.id)
  if (!digest || digest.status !== 'published') notFound()

  return (
    <div style={{ minHeight: '100vh' }}>
      <DigestView digest={digest} showHeroPersonality={false} />
      <footer style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '24px clamp(20px, 5vw, 32px) 96px',
        textAlign: 'center',
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.65rem',
        color: 'rgba(var(--text-base), 0.3)',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}>
        End of edition
      </footer>
    </div>
  )
}
