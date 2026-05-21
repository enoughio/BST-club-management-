import { NextResponse } from 'next/server'

export async function POST(request) {
  const res = NextResponse.json({ ok: true })

  // Clear the auth cookies
  res.cookies.set('x-bst-token', '', { path: '/', maxAge: 0 })
  res.cookies.set('x-bst-user-role', '', { path: '/', maxAge: 0 })

  return res
}
