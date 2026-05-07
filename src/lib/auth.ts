const COOKIE_NAME = 'acro-admin'
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? 'acro-dev-secret'
}

async function hmac(payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createAdminToken(): Promise<string> {
  const expiry = Date.now() + TOKEN_TTL
  const payload = `admin:${expiry}`
  const sig = await hmac(payload)
  return btoa(`${payload}:${sig}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const padded = token.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '='))
    const lastColon = decoded.lastIndexOf(':')
    const payload = decoded.slice(0, lastColon)
    const sig = decoded.slice(lastColon + 1)
    const parts = payload.split(':')
    if (parts[0] !== 'admin') return false
    const expiry = parseInt(parts[1], 10)
    if (isNaN(expiry) || Date.now() > expiry) return false
    const expectedSig = await hmac(payload)
    return sig === expectedSig
  } catch {
    return false
  }
}

export { COOKIE_NAME }
