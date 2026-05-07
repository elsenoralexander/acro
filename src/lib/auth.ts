import crypto from 'crypto'

const COOKIE_NAME = 'acro-admin'
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? 'acro-dev-secret'
}

export function createAdminToken(): string {
  const expiry = Date.now() + TOKEN_TTL
  const payload = `admin:${expiry}`
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const lastColon = decoded.lastIndexOf(':')
    const payload = decoded.slice(0, lastColon)
    const sig = decoded.slice(lastColon + 1)
    const parts = payload.split(':')
    if (parts[0] !== 'admin') return false
    const expiry = parseInt(parts[1], 10)
    if (isNaN(expiry) || Date.now() > expiry) return false
    const expectedSig = crypto.createHmac('sha256', secret()).update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))
  } catch {
    return false
  }
}

export { COOKIE_NAME }
