const COOKIE_NAME = 'digest_admin'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export { COOKIE_NAME, COOKIE_MAX_AGE }

export async function hashPassword(pw: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(`digest-admin-v1:${pw}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
