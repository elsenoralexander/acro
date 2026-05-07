import fs from 'fs'
import path from 'path'
import { products } from './products'

export type CatalogData = {
  stock: Record<string, number>
  prices: Record<string, number>
  discounts: Record<string, number> // 0-100 percentage
}

const CATALOG_FILE = path.join(process.cwd(), 'src/data/catalog.json')
const BLOB_PATHNAME = 'acro-catalog.json'

function defaultCatalog(): CatalogData {
  const stock: Record<string, number> = {}
  const prices: Record<string, number> = {}
  const discounts: Record<string, number> = {}
  for (const p of products) {
    stock[p.id] = 1
    prices[p.id] = p.price
    discounts[p.id] = 0
  }
  return { stock, prices, discounts }
}

// Merges stored data with defaults so new products always initialize correctly
function mergeCatalog(stored: unknown): CatalogData {
  const defaults = defaultCatalog()
  const s = stored as Record<string, unknown>

  // Handle legacy flat stock format: { "01": 1, "02": 1 }
  if (s && !s.stock && typeof s['01'] === 'number') {
    return {
      stock: { ...defaults.stock, ...(s as Record<string, number>) },
      prices: defaults.prices,
      discounts: defaults.discounts,
    }
  }

  const d = s as Partial<CatalogData>
  return {
    stock: { ...defaults.stock, ...(d.stock ?? {}) },
    prices: { ...defaults.prices, ...(d.prices ?? {}) },
    discounts: { ...defaults.discounts, ...(d.discounts ?? {}) },
  }
}

function getBlobToken(): string | undefined {
  for (const key of Object.keys(process.env)) {
    if (key === 'BLOB_READ_WRITE_TOKEN' || key.endsWith('_BLOB_READ_WRITE_TOKEN')) {
      return process.env[key]
    }
  }
  return undefined
}

function readLocalCatalog(): CatalogData {
  try {
    return mergeCatalog(JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8')))
  } catch {
    return defaultCatalog()
  }
}

export async function getCatalog(): Promise<CatalogData> {
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
        if (res.ok) return mergeCatalog(await res.json())
      }
    } catch (err) {
      console.error('[catalog] getCatalog error:', err)
    }
  }
  return readLocalCatalog()
}

export async function saveCatalog(catalog: CatalogData): Promise<void> {
  const token = getBlobToken()
  if (token) {
    const { put, del, list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_PATHNAME, token })
    const existing = blobs.find((b) => b.pathname === BLOB_PATHNAME)
    if (existing) await del(existing.url, { token })
    await put(BLOB_PATHNAME, JSON.stringify(catalog), {
      access: 'private',
      addRandomSuffix: false,
      token,
    })
    return
  }
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2))
}

export { finalPrice } from './price'
