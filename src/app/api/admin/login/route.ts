import { NextResponse } from 'next/server'
import { COOKIE_NAME, COOKIE_MAX_AGE, hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }))
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }
  const hash = await hashPassword(password)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, hash, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
  return res
}
