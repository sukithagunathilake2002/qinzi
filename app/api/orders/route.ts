import { NextRequest, NextResponse } from 'next/server'
import { createMongoOrder, getMongoOrders } from '@/lib/mongo-orders'
import { Order } from '@/lib/types'

export async function GET() {
  try {
    const orders = await getMongoOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Failed to load orders:', error)
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const order = await request.json() as Order

    if (!order.id || !order.customerName || !order.customerEmail) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 })
    }

    await createMongoOrder(order)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
