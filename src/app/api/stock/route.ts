import { NextResponse } from 'next/server'
import { getCatalog } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

// Kept for backwards compat — product pages read stock from here
export async function GET() {
  const catalog = await getCatalog()
  return NextResponse.json(catalog.stock)
}
