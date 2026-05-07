import fs from 'fs'
import path from 'path'

export type StockData = Record<string, number>

const STOCK_FILE = path.join(process.cwd(), 'src/data/stock.json')
const BLOB_PATHNAME = 'acro-stock.json'

function readLocalStock(): StockData {
  try {
    return JSON.parse(fs.readFileSync(STOCK_FILE, 'utf-8'))
  } catch {
    return { '01': 1, '02': 1 }
  }
}

export async function getAllStock(): Promise<StockData> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import('@vercel/blob')
      const { blobs } = await list({ prefix: BLOB_PATHNAME })
      const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME)
      if (blob) {
        const res = await fetch(blob.url, { cache: 'no-store' })
        if (res.ok) return res.json()
      }
    } catch (err) {
      console.error('[stock] getAllStock error:', err)
    }
  }

  return readLocalStock()
}

export async function setAllStock(stock: StockData): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    await put(BLOB_PATHNAME, JSON.stringify(stock), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    return
  }

  fs.writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2))
}

export async function getProductStock(productId: string): Promise<number> {
  const stock = await getAllStock()
  return stock[productId] ?? 0
}
