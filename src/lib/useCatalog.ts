'use client'

import { useEffect, useState } from 'react'
import { finalPrice } from './price'

type CatalogData = {
  stock: Record<string, number>
  prices: Record<string, number>
  discounts: Record<string, number>
}

const cache: { data: CatalogData | null; ts: number } = { data: null, ts: 0 }
const TTL = 60_000 // 1 min

export function useCatalog() {
  const [catalog, setCatalog] = useState<CatalogData | null>(cache.data)

  useEffect(() => {
    if (cache.data && Date.now() - cache.ts < TTL) {
      setCatalog(cache.data)
      return
    }
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((d: CatalogData) => {
        cache.data = d
        cache.ts = Date.now()
        setCatalog(d)
      })
      .catch(() => {})
  }, [])

  function getPrice(productId: string, basePrice: number): number {
    if (!catalog) return basePrice
    const price = catalog.prices[productId] ?? basePrice
    const discount = catalog.discounts[productId] ?? 0
    return finalPrice(price, discount)
  }

  function getStock(productId: string): number | null {
    if (!catalog) return null
    return catalog.stock[productId] ?? 0
  }

  return { catalog, getPrice, getStock }
}
