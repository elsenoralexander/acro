import fs from 'fs'
import path from 'path'

export type StockData = Record<string, number>

const STOCK_FILE = path.join(process.cwd(), 'src/data/stock.json')
const BLOB_PATHNAME = 'acro-stock.json'

function getBlobToken(): string | undefined {
  // Vercel puede llamar a la variable BLOB_READ_WRITE_TOKEN o {NOMBRE}_BLOB_READ_WRITE_TOKEN
  for (const key of Object.keys(process.env)) {
    if (key === 'BLOB_READ_WRITE_TOKEN' || key.endsWith('_BLOB_READ_WRITE_TOKEN')) {
      return process.env[key]
    }
  }
  return undefined
}

function readLocalStock(): StockData {
  try {
    return JSON.parse(fs.readFileSync(STOCK_FILE, 'utf-8'))
  } catch {
    return { '01': 1, '02': 1 }
  }
}

export async function getAllStock(): Promise<StockData> {
  const token = getBlobToken()
  if (token) {
    try {
      const { list } = await import('@vercel/blob')
      const { blobs } = await list({ prefix: BLOB_PATHNAME, token })
      const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME)
      if (blob) {
        const res = await fetch(blob.url, {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) return res.json()
      }
    } catch (err) {
      console.error('[stock] getAllStock error:', err)
    }
  }
  return readLocalStock()
}

export async function setAllStock(stock: StockData): Promise<void> {
  const token = getBlobToken()
  if (token) {
    const { put, del, list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_PATHNAME, token })
    const existing = blobs.find((b) => b.pathname === BLOB_PATHNAME)
    if (existing) await del(existing.url, { token })
    await put(BLOB_PATHNAME, JSON.stringify(stock), {
      access: 'private',
      addRandomSuffix: false,
      token,
    })
    return
  }
  fs.writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2))
}

export async function getProductStock(productId: string): Promise<number> {
  const stock = await getAllStock()
  return stock[productId] ?? 0
}
