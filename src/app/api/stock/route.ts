import { NextRequest, NextResponse } from 'next/server'
import { getAllStock, setAllStock } from '@/lib/stock'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const stock = await getAllStock()
  return NextResponse.json(stock)
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { productId, quantity } = body as { productId: string; quantity: number }

  if (!productId || typeof quantity !== 'number' || quantity < 0) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const stock = await getAllStock()
  stock[productId] = Math.floor(quantity)
  await setAllStock(stock)

  return NextResponse.json({ ok: true, stock })
}
