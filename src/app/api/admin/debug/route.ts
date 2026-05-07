import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const blobKeys = Object.keys(process.env).filter(
    (k) => k.includes('BLOB') || k.includes('blob')
  )

  let blobTest: string | null = null
  const blobToken = Object.keys(process.env).find(
    (k) => k === 'BLOB_READ_WRITE_TOKEN' || k.endsWith('_BLOB_READ_WRITE_TOKEN')
  )

  if (blobToken) {
    try {
      const { list } = await import('@vercel/blob')
      const result = await list({ token: process.env[blobToken] })
      blobTest = `OK — ${result.blobs.length} blobs encontrados`
    } catch (err) {
      blobTest = `ERROR: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  return NextResponse.json({
    blobEnvKeys: blobKeys,
    blobTokenKey: blobToken ?? null,
    blobTest,
  })
}
