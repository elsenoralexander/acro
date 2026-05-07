import { NextRequest, NextResponse } from 'next/server'
import { getCatalog, saveCatalog } from '@/lib/catalog'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const catalog = await getCatalog()
  return NextResponse.json(catalog)
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json() as {
    productId: string
    quantity?: number
    price?: number
    discount?: number
  }

  const { productId, quantity, price, discount } = body

  if (!productId) {
    return NextResponse.json({ error: 'productId requerido' }, { status: 400 })
  }

  const catalog = await getCatalog()

  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
    }
    catalog.stock[productId] = Math.floor(quantity)
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
    }
    catalog.prices[productId] = price
  }

  if (discount !== undefined) {
    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
      return NextResponse.json({ error: 'Descuento inválido (0-100)' }, { status: 400 })
    }
    catalog.discounts[productId] = discount
  }

  try {
    await saveCatalog(catalog)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[api/catalog] PUT error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  return NextResponse.json({ ok: true, catalog })
}
